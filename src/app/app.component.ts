import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SignalRService} from '../infra/httpRequest/services/signal-r.service';
import {HttpClient} from '@angular/common/http';
import {changePosition, Tile, toNameImage, toPlate} from '../domain/Tile';
import HttpTileRepositoryService from '../infra/httpRequest/http-tile-repository.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {fromBag, fromBoard, Player, RestTilesPlay, RestTilesSwap, Rack, ListGamedId} from '../domain/player';
import {PanZoomAPI, PanZoomConfig, PanZoomConfigOptions, PanZoomModel} from 'ngx-panzoom';
import {Subscription} from 'rxjs';
import { toTileviewModel} from '../domain/tiles';
import {toRarrange, toTiles} from '../domain/SetPositionTile';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('scene', {static: false}) scene!: ElementRef;
  title = 'qwirkle';
  rack: Tile[] = [];
  board: Tile[] = [];
  bag: Tile[] = [];
  plate: Tile[][] = [[]];
  playTile: RestTilesPlay[] = [];
  swapTile: RestTilesSwap[] = [];
  score: Rack={code: 0, tilesPlayed : [], newRack: [], points: 0 };
  voidTile: Tile[] = [{disabled: false, id: 0, shape: 0, color: 0, y: 0, x: 0}];
  totalScore = 0;
  gameId = 0;
  userId = 0;
  player!: Player;
  playerNameToPlay: string='';
  nameToTurn: string='';
  panzoomModel!: PanZoomModel;
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
  private modelChangedSubscription!: Subscription;
  private panZoomAPI!: PanZoomAPI;
  private apiSubscription!: Subscription;
  players: Player[] = [];
  games: ListGamedId = {listGameId: []};
  private playTileTempory: RestTilesPlay[] = [];
  winner = '';
  constructor(private changeDetector: ChangeDetectorRef, public signalRService: SignalRService,
              private http: HttpClient, private serviceQwirkle: HttpTileRepositoryService) {
    this.reset();
  }

  private reset(): void {
    this.score = {
      code: 1,
      tilesPlayed: [],
      newRack: [],
      points: 0
    };
    this.board = [];
    this.nameToTurn = '';
    this.player = {
      id: 0,
      pseudo: '',
      gameId: 0,
      gamePosition: 0,
      points: 0,
      lastTurnPoints: 0,
      rack: {tiles: []},
      isTurn: true
    };
  }

  ngOnInit(): void {

    this.signalRService.startConnection();

    this.signalRService.hubConnection.on('ReceivePlayersInGame', (playersIds: any[]) => {
      this.receivePlayersInGame(playersIds);
    });
    this.signalRService.hubConnection.on('ReceiveTilesPlayed', (playerId: number, scoredPoints: number, tilesPlayed: any[]) => {
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
    const shelveDisplay = document.querySelector('.container') as HTMLElement;
    const height = shelveDisplay.clientHeight;
    const width = shelveDisplay.clientWidth;

    this.panzoomConfig.initialZoomToFit = {
      x: 0,
      y: 0,
      width,
      height
    };


  }

  receivePlayersInGame = (players: any[]) => {
    players.forEach(player => {
      console.log('playerId ' + player.playerId + ' is in the game'); // TODO replace log
    });
  }

  receiveTilesPlayed = async (playerId: number, scoredPoints: number, tilesPlayed: any[]) => {
    this.game().then();

  }

  receiveTilesSwapped = (playerId: number) => {
    console.log('player ' + playerId + 'has swapped some tiles'); // TODO replace log
  }

  receivePlayerIdTurn = (playerId: number) => {
    console.log('it\'s playerId ' + playerId + ' turn'); // TODO replace log
  }

  receiveGameOver = (winnerPlayersIds: number[]) => {
    winnerPlayersIds.forEach(playerId => {
      console.log('playerId ' + playerId + ' has win the game'); // TODO replace log
    });
  }

  async autoZoom(): Promise<void> {
    this.resetZoomToFit();
    this.changeDetector.detectChanges();
    const height = this.scene.nativeElement.clientHeight;
    const width = this.scene.nativeElement.clientWidth;
    const xmin: number = Math.min(...this.board.map(tile => tile.x));
    const ymin = this.getYmin();
    const ymax = this.getYmax();
    if (ymin >= 0) {
      if (xmin <= 0) {


        this.panZoomAPI.zoomToFit({
          x: 300,
          y: -400,
          width,
          height: height * (Math.abs(ymax - ymin) * 100) / 600
        });

      } else {

        this.panZoomAPI.zoomToFit({
          x: 550,
          y: -400,
          width,
          height: height * (Math.abs(ymax - ymin) * 100) / 600
        });
      }
    } else {

      this.panZoomAPI.zoomToFit({
        x: 650,
        y: -400,
        width,
        height: height * (Math.abs(ymax - ymin) * 100) / 600
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
    return ''
  }

  drop(event: CdkDragDrop<Tile[], any>, index: number): void {

    this.board = changePosition(this.board, event.previousContainer.data[event.previousIndex],
      this.plate[index][event.currentIndex].x, this.plate[index][event.currentIndex].y);

    if (event.previousContainer !== event.container) {
      this.rack = this.rack.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);
      this.bag = this.bag.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);

    }
    this.plate = toPlate(this.board);
    this.score = {
      code: 1,
      tilesPlayed: [],
      newRack: [],
      points: 0
    };
    this.playTileTempory = fromBoard(this.board.filter(tile => tile.disabled), this.player.id);
    this.serviceQwirkle.playTileSimulation(this.playTileTempory).then(async (resp) => {
      this.score = resp;
      this.autoZoom().then();
    });



    }

  dropempty(event: CdkDragDrop<Tile[], any>): void {
    this.board = changePosition(this.board, event.previousContainer.data[event.previousIndex], 0, 0);
    if (event.previousContainer !== event.container) {
      this.rack = this.rack.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);


    }

    this.plate = toPlate(this.board);
    this.autoZoom().then();

  }

  dropInBag(event: CdkDragDrop<Tile[], any>, index: number): void {
    this.board = changePosition(this.bag, event.previousContainer.data[event.previousIndex], 0, 0);
    if (event.previousContainer !== event.container) {
      this.rack = this.rack.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);
      // attention : le previous peut potentiellement être le board. à gérer dans ce cas et faire filter sur board et non sur result

    }

    this.plate = toPlate(this.board);
  }

  async game(): Promise<void> {



    this.serviceQwirkle.getPlayerNameToPlay(this.gameId).subscribe(res => {
      this.nameToTurn = '';
      if (this.winner === ''){this.nameToTurn = res; }
    });


    this.serviceQwirkle.getGames(this.gameId).then(board => {
       this.board = board.boards;
       this.plate = toPlate(this.board);
       this.players = board.players;
       this.player = board.players.filter(player => player.id === this.player.id)[0];
      this.player.rack.tiles.sort((a, b) => a.rackPosition - b.rackPosition);

      this.rack = toRarrange(this.player.rack.tiles);
       this.autoZoom();

    });



  }

  async valid(): Promise<void> {
    this.playTile = fromBoard(this.board.filter(tile => tile.disabled), this.player.id);
    this.serviceQwirkle.playTile(this.playTile).then(async (resp) => {
        this.score = resp;

        this.getPlayerIdToPlay().then();
        this.game().then();
        this.score = {
        code: 1,
        tilesPlayed: [],
        newRack: [],
        points: 0
      };
      }
    );

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



    }
    this.player.rack.tiles = toTiles(this.rack);
    this.player.rack.tiles.sort((a, b) => a.rackPosition - b.rackPosition);

    if (this.rack.length === 6){
    this.serviceQwirkle.rackChangeOrder(toTileviewModel(this.player)).then((async rack => {
      this.serviceQwirkle.getGames(this.gameId).then(board => this.players = board.players);
      this.player = this.players.filter(player => player.id === this.player.id)[0];
      this.player.rack.tiles.sort((a, b) => a.rackPosition - b.rackPosition);
      this.rack = toRarrange(this.player.rack.tiles);
    })); }
  }




   gameChange(gameId: number): void {
    this.gameId = gameId;
    this.serviceQwirkle.getGames(this.gameId).then(board => {
      this.players = board.players;

      this.serviceQwirkle.getWinners(this.gameId).then(res => {
          this.winner = '';
          if (res !== null){
        this.winner = board.players.filter(player => player.id === res[0])[0].pseudo;
        this.nameToTurn = '';
        }
        });

        this.serviceQwirkle.getPlayer(gameId, this.userId).then((result) => {
         this.player = result;
          this.player.rack.tiles.sort((a, b) => a.rackPosition - b.rackPosition);


         console.log('playerId :' + this.player.id);
         this.getPlayerIdToPlay().then();
         this.nameToTurn = '';

         this.game().then();

         this.signalRService.sendPlayerInGame(gameId, this.player.id);
                 this.rack = toRarrange(this.player.rack.tiles);
         this.changeDetector.detectChanges();
       });


    });
  }

  async countUserChange(event: number): Promise<void> {
    this.userId = event;
    this.games = await this.serviceQwirkle.getGamesByUserId(this.userId);
  }

  getPawStyle(i: number): string {
    return 'translate(' + -i * 65 + 'px,' + i * 15 + 'px)';
  }


  NewGame(): void {
    this.serviceQwirkle.newGame([1, 2]).then();
  }

  async getPlayerIdToPlay(): Promise<void> {
    this.serviceQwirkle.getPlayerNameToPlay(this.gameId).subscribe((res) => {
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


