import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SignalRService} from '../infra/httpRequest/services/signal-r.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {changePosition, Tile, toNameImage, toPlate} from '../domain/Tile';
import HttpTileRepositoryService from '../infra/httpRequest/http-tile-repository.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {fromBag, fromBoard, Player, RestTilesPlay, RestTilesSwap, Result} from '../infra/httpRequest/player';
import {PanZoomAPI, PanZoomConfig, PanZoomConfigOptions, PanZoomModel} from 'ngx-panzoom';
import {Subscription} from 'rxjs';

const headers = new HttpHeaders()
  .set('Access-Control-Allow-Origin', '*')
  .set('Content-Type', 'application/json; charset=utf-8');

interface Point {
  x: number;
  y: number;
}

interface Rect {
  x: number; // the x0 (top left) coordinate
  y: number; // the y0 (top left) coordinate
  width: number; // the x1 (bottom right) coordinate
  height: number; // the y1 (bottom right) coordinate
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('scene', {static: false}) scene: ElementRef;
  title = 'qwirkle';
  rack: Tile[] = [];
  board: Tile[] = [];
  bag: Tile[] = [];
  plate: Tile[][] = [[]];
  playTile: RestTilesPlay[] = [];
  swapTile: RestTilesSwap[] = [];
  score: Result;
  voidTile: Tile[] = [{disabled: false, id: 0, form: 0, color: 0, y: 0, x: 0}];
  totalScore = 0;
  gamedId = 0;
  player: Player;
  playerNameToPlay: string;
  nameToTurn: string;
  panzoomModel: PanZoomModel;
  private panZoomConfigOptions: PanZoomConfigOptions = {
    zoomLevels: 10,
    scalePerZoomLevel: 2.0,
    zoomStepDuration: 0.2,
    freeMouseWheelFactor: 0.01,
    zoomToFitZoomLevelFactor: 0.9,
    dragMouseButton: 'right'
  };
  panzoomConfig: PanZoomConfig = new PanZoomConfig(this.panZoomConfigOptions);
  scale = this.getCssScale(this.panzoomConfig.initialZoomLevel);
  private modelChangedSubscription: Subscription;
  private panZoomAPI: PanZoomAPI;
  private apiSubscription: Subscription;
  userId: number;

  constructor(private changeDetector: ChangeDetectorRef, public signalRService: SignalRService,
              private http: HttpClient, private serviceQwirkle: HttpTileRepositoryService) {
    this.score = {
      code: 0,
      tilesPlayed: [],
      newRack: [],
      points: 0
    };
    this.nameToTurn = '';
    this.player = {
      id: 0,
      pseudo: '',
      gameId: 0,
      gamePosition: 0,
      points: 0,
      lastTurnPoints : 0,
      rack: {tiles: []},
      isTurn: true
    };
  }

  ngOnInit(): void {
    this.signalRService.startConnection();

    this.signalRService.hubConnection.on('ReceivePlayersInGame', (playersIds: any[]) => {
      this.receivePlayersInGame(playersIds);
    });
    this.signalRService.hubConnection.on('ReceiveTilesPlayed', (playerId: number, scoredPoints:number, tilesPlayed: any[]) => {
      this.receiveTilesPlayed(playerId, scoredPoints, tilesPlayed).then();
    });
    this.signalRService.hubConnection.on('ReceiveTilesSwapped', (playerId: number) => {
      this.receiveTilesSwapped(playerId);
    });
    this.signalRService.hubConnection.on('ReceivePlayerIdTurn', (playerId: number) => {
      this.receivePlayerIdTurn(playerId);
    });
    this.signalRService.hubConnection.on('ReceiveGameOver', (winnersPlayersIds: number[]) => {
      this.receiveGameOver(winnersPlayersIds);
    });
    this.modelChangedSubscription = this.panzoomConfig.modelChanged.subscribe((model: PanZoomModel) => this.onModelChanged(model));
    this.apiSubscription = this.panzoomConfig.api.subscribe((api: PanZoomAPI) => this.panZoomAPI = api);
  }

  onModelChanged(model: PanZoomModel): void {
    this.panzoomModel = model;
    this.scale = this.getCssScale(this.panzoomModel.zoomLevel);
    this.changeDetector.markForCheck();
    this.changeDetector.detectChanges();
  }

  ngAfterViewInit(): void {
    this.resetZoomToFit();
    this.changeDetector.detectChanges();
  }

  resetZoomToFit(): void {
    const height = this.scene.nativeElement.clientHeight;
    const width = this.scene.nativeElement.clientWidth;

    this.panzoomConfig.initialZoomToFit = {
      x: 0,
      y: 0,
      width,
      height
    };


  }

  receivePlayersInGame = (players: any[]) => {
    players.forEach(player => {
      console.log('playerId ' + player.playerId + ' is in the game'); //TODO replace log
    });
  }

  receiveTilesPlayed = async (playerId: number, scoredPoints:number, tilesPlayed: any[]) => {
    this.game().then();
    // console.log(playerId + ' has played:');
    // tilesPlayed.forEach(tilePlayed => {
    //   console.log('color: ' + tilePlayed.color + ' form: ' + tilePlayed.form + ' x: '
    //     + tilePlayed.coordinates.x + ' y: ' + tilePlayed.coordinates.y);
    // });
  }

  receiveTilesSwapped = (playerId: number) => {
    console.log('player ' + playerId + 'has swapped some tiles'); //TODO replace log
  }

  receivePlayerIdTurn = (playerId: number) => {
    console.log('it\'s playerId ' + playerId + ' turn'); //TODO replace log
  }

  receiveGameOver = (winnerPlayersIds: number[]) => {
    winnerPlayersIds.forEach(playerId => {
      console.log('playerId ' + playerId + ' has win the game'); //TODO replace log
    });
  }

  async autoZoom(): Promise<void> {
    this.resetZoomToFit();
    this.changeDetector.detectChanges();
    const height = this.scene.nativeElement.clientHeight;
    const width = this.scene.nativeElement.clientWidth;
    const xmin: number = Math.min(...this.board.map(tile => tile.x));
    const xmax = this.xmax();
    const ymin = this.getYmin();
    const ymax = this.getYmax();
    const shelveDisplay = document.querySelector('.container');
    if (ymin >= 0) {
      if (xmin <= 0) {


        this.panZoomAPI.zoomToFit({
          x: 300,
          y: -600,
          width,
          height
        });

      } else {

        this.panZoomAPI.zoomToFit({
          x: 600,
          y: -400,
          width,
          height
        });
      }
    } else {

      this.panZoomAPI.zoomToFit({
        x: 400,
        y: -500,
        width,
        height: height * 2
      });
    }


    this.changeDetector.detectChanges();


  }

  private getYmin(): number {
    return Math.min(...this.board.map(tile => tile.y));
  }

  private getYmax(): number {
    return Math.max(...this.board.map(tile => tile.y));
  }

  private xmax(): number {
    return   Math.max(...this.board.map(tile => tile.x));
  }



  getRackTileImage(tile: Tile): string {

    return '../../assets/img/' + toNameImage(tile);
  }

  getLineStyle(line: Tile[], i: number): string {
    if (line[0] !== undefined) {
      return 'translate(' + 0 + 'px,' + i * 100 + 'px)';
    }

  }

  drop(event: CdkDragDrop<Tile[], any>, index: number): void {

    this.board = changePosition(this.board, event.previousContainer.data[event.previousIndex],
      this.plate[index][event.currentIndex].x, this.plate[index][event.currentIndex].y);

    if (event.previousContainer === event.container) {


    } else {
      this.rack = this.rack.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);
      this.validSimulation();

    }
    this.plate = toPlate(this.board);

  }

  dropempty(event: CdkDragDrop<Tile[], any>, index: number): void {
    this.board = changePosition(this.board, event.previousContainer.data[event.previousIndex], 0, 0);
    if (event.previousContainer === event.container) {


    } else {
      this.rack = this.rack.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);


    }

    this.plate = toPlate(this.board);


  }

  dropInBag(event: CdkDragDrop<Tile[], any>, index: number): void {
    this.board = changePosition(this.bag, event.previousContainer.data[event.previousIndex], 0, 0);
    if (event.previousContainer !== event.container) {
      this.rack = this.rack.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);
      // attention : le previous peut potentiellement être le board. à gérer dans ce cas et faire filter sur board et non sur result

    }

    this.plate = toPlate(this.board); // j'ai pas bien compris ce que ça fait. a adapter...
  }

  async game(): Promise<void> {
    this.serviceQwirkle.getPlayerNameToPlay(this.gamedId).subscribe(res => {
      this.nameToTurn = res;

    });

    this.board = await this.serviceQwirkle.getGames(this.gamedId);
    this.plate = toPlate(this.board);

  }

  async valid(): Promise<void> {
    this.playTile = fromBoard(this.board.filter(tile => tile.disabled), this.player.id);
    this.serviceQwirkle.playTile(this.playTile).then(async (resp) => {
        this.score = resp;

        this.getPlayerIdToPlay().then();
        this.game().then();
        await this.serviceQwirkle.getPlayers(this.gamedId).then((result) => {
          this.player = result.filter(player => player.id === this.player.id)[0];
          this.rack = this.player.rack.tiles;
        });
      }
    );
  }

  async validSimulation(): Promise<void> {
    this.playTile = fromBoard(this.board.filter(tile => tile.disabled), this.player.id);
    if (this.playTile.length > 0) {
      this.serviceQwirkle.playTileSimulation(this.playTile).then((resp) => { this.score = resp; console.log(this.score.points); /*TODO remove log*/} );
    }
    else {
      this.score.points = 0;
      console.log(this.score.points); //TODO remove log
    }
  }

  async swapTiles(): Promise<void> {
    this.swapTile = fromBag(this.bag.filter(tile => tile.disabled), this.player.id);
    this.serviceQwirkle.swapTile(this.swapTile).then((resp) => {
        this.game().then();
        this.getPlayerIdToPlay().then();
      }
    );
  }

  async skipTurn(): Promise<void> {
    this.serviceQwirkle.skipTurn(this.player.id).then((resp) => {
        this.game().then();
        this.getPlayerIdToPlay().then();
      }
    );
  }

  dropResult(event: CdkDragDrop<Tile[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.board = this.board.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.plate = toPlate(this.board);
      this.validSimulation();
    }

  }

  playerChange(event: Player): void {
    this.signalRService.sendPlayerInGame(this.gamedId, event.id);
    this.player = event;
    this.rack = this.player.rack.tiles;

  }

   countChange(event: number): void {
    this.gamedId = event;
    this.getPlayerIdToPlay().then();
    this.nameToTurn = '';

    this.game().then( () =>
       this.autoZoom().then());

  }

  countUserChange(event: number): void {
    this.userId = event;
  }

  getPawStyle(i: number): string {
    return 'translate(' + -i * 65 + 'px,' + i * 15 + 'px)';
  }

  getboardStyle(i: number): string {
    return 'translate(' + 0 + 'px,' + 0 + 'px)';
  }

  NewGame(): void {
    this.serviceQwirkle.newGame([10, 11]).then();
  }

  async getPlayerIdToPlay(): Promise<void> {
    this.serviceQwirkle.getPlayerNameToPlay(this.gamedId).subscribe((res) => {
      this.playerNameToPlay = res;

    });
  }

  ngOnDestroy(): void {
    this.modelChangedSubscription.unsubscribe();
    this.apiSubscription.unsubscribe();
  }

  private getCssScale(zoomLevel: any): number {
    return Math.pow(this.panzoomConfig.scalePerZoomLevel, zoomLevel - this.panzoomConfig.neutralZoomLevel);
  }

}


