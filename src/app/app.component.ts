import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {SignalRService} from '../infra/httpRequest/services/signal-r.service';
import {HttpClient} from '@angular/common/http';
import { getInsertTile, insertPosition, Tile, toNameImage, toPlate} from '../domain/Tile';
import HttpTileRepositoryService from '../infra/httpRequest/http-tile-repository.service';
import {CdkDragDrop,  moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {
  fromBag,
  fromBoard,
  Player,
  RestTilesPlay,
  RestTilesSwap,
  Rack,
  ListGamedId,
  ListUsersId
} from '../domain/player';
import {PanZoomAPI, PanZoomConfig, PanZoomConfigOptions, PanZoomModel} from 'ngx-panzoom';
import {Subscription} from 'rxjs';
import { toTileviewModel} from '../domain/tiles';
import {toRarrange, toRarrangeRack, toTiles} from '../domain/SetPositionTile';

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
  @ViewChild('scene', {static: false}) scene!: ElementRef;
  title = 'qwirkle';
  rack: Tile[] = [];
  board: Tile[] = [];
  bag: Tile[] = [];
  plate: Tile[][] = [[]];
  playTile: RestTilesPlay[] = [];
  swapTile: RestTilesSwap[] = [];
  score: Rack={code: 1, tilesPlayed : [], newRack: [], points: 0 };
  voidTile: Tile[] = [{disabled: false, id: 0, shape: 0, color: 0, y: 0, x: 0}];
  totalScore = 0;
  gameId = 0;
  userId = 0;
  player: Player={
    id: 0,
    pseudo: '',
    gameId: 0,
    gamePosition: 0,
    points: 0,
    lastTurnPoints: 0,
    rack: {tiles: []},
    isTurn: true
  };
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
  public users: ListUsersId={listUsersId: []};
  constructor(private changeDetector: ChangeDetectorRef, public signalRService: SignalRService,
              private http: HttpClient, private serviceQwirkle: HttpTileRepositoryService) {

  }



  ngOnInit(): void {
     this.serviceQwirkle.getUsers().then(res=>{
       this.users=res
    });
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
    const xmin: number = this.getXmin() ;
    const xmax: number =  this.getXmax();
    const ymin =this.getYmin() ;
    const ymax = this.getYmax();

    const newRect:Rect=this.newrect(ymin, xmin, width, height, xmax, ymax);

    this.panZoomAPI.zoomToFit(newRect);
    this.changeDetector.detectChanges();


  }

  private newrect(ymin: number, xmin: number, width: number, height: number, xmax: number, ymax: number):Rect {
    let newRect: Rect;
    if (ymin >= 0) {
      if (xmin <= 0) {
         newRect=this.isInRightBottom(width, height, xmax, xmin, ymax, ymin)


      } else {
        newRect= this.isInRightTop(width, height, xmax, xmin, ymax, ymin)


      }
    } else {
      newRect= this.isInLeft(width, height, xmax, xmin, ymax, ymin)


    }
    return newRect
  }

  private isInLeft(width: number, height: number, xmax: number, xmin: number, ymax: number, ymin: number) {
    return {
      x: 650,
      y: -400,
      width: width * (Math.abs(xmax - xmin) * 100) / 1000+width/1000,
      height: height * (Math.abs(ymax - ymin) * 100) / 600+height/1000
    };
  }
  private isInRightTop(width: number, height: number, xmax: number, xmin: number, ymax: number, ymin: number) {
    return {
      x: 550,
      y: -400,
      width: width * (Math.abs(xmax - xmin) * 100) / 1000+width/1000,
      height: height * (Math.abs(ymax - ymin) * 100) / 600+height/1000
    };
  }

  private  isInRightBottom(width: number, height: number, xmax: number, xmin: number, ymax: number, ymin: number) {
    return {
      x: width / 2 + 200,
      y: -height,
      width: width * (Math.abs(xmax - xmin) * 100) / 1000,
      height: height * (Math.abs(ymax - ymin) * 100) / 600 + height
    };
  }

  private getXmin() {
    return Math.min(...this.board.map(tile => tile.x));
  }

  private getYmin(): number {
    return Math.min(...this.board.map(tile => tile.y));
  }

  private getYmax(): number {
    return Math.max(...this.board.map(tile => tile.y));
  }

  private getXmax(): number {
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

    this.board = insertPosition(this.board, getInsertTile(event.previousContainer.data[event.previousIndex],
      this.plate[index][event.currentIndex].x, this.plate[index][event.currentIndex].y),this.plate[index][event.currentIndex].x);

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
    this.board = insertPosition(this.board, getInsertTile(event.previousContainer.data[event.previousIndex], 0, 0),0);
    if (event.previousContainer !== event.container) {
      this.rack = this.rack.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);


    }

    this.plate = toPlate(this.board);
    this.autoZoom().then();

  }


  async game(): Promise<void> {



    this.serviceQwirkle.getPlayerNameTurn(this.gameId).subscribe(res => {
      this.nameToTurn = '';
      if (this.winner === ''){this.nameToTurn = res; }
    });


    this.serviceQwirkle.getGame(this.gameId).then(board => {
       this.board = board.boards;
       this.plate = toPlate(this.board);
       board.players.sort((a, b) => a.id - b.id);
       this.players = board.players
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
        this.bag=[];
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
    this.rack=toRarrangeRack(event.container.data)
    this.player.rack.tiles = toTiles(this.rack);

    if (this.rack.length === 6){
    this.serviceQwirkle.rackChangeOrder(toTileviewModel(this.player)).then((async rack => {
      this.serviceQwirkle.getGame(this.gameId).then(board => {this.players = board.players;
      this.player = this.players.filter(player => player.id === this.player.id)[0];
      this.player.rack.tiles.sort((a, b) => a.rackPosition - b.rackPosition);
      this.rack = toRarrange(this.player.rack.tiles);
      console.log(this.player.rack.tiles)
      this.changeDetector.detectChanges();});
    })); }
  }




   gameChange(gameId: number): void {
    this.gameId = gameId;
    this.serviceQwirkle.getGame(this.gameId).then(board => {
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
    this.serviceQwirkle.getGamesByUserId(this.userId).then((res)=>
      {this.games=res;
        this.games.listGameId.sort((a, b) => a - b);

      }
    );

    this.resetZoomToFit();
  }

  getPawStyle(i: number): string {
    return 'translate(' + -i * 65 + 'px,' + i * 15 + 'px)';
  }


  NewGame(): void {
    this.serviceQwirkle.newGame([10, 11]).then();
  }

  async getPlayerIdToPlay(): Promise<void> {
    this.serviceQwirkle.getPlayerNameTurn(this.gameId).subscribe((res) => {
      this.playerNameToPlay = res;

    });
  }

  ngOnDestroy(): void {
    this.modelChangedSubscription.unsubscribe();
    this.apiSubscription.unsubscribe();
  }

  getCssScale(zoomLevel: any): number {
    return Math.pow(this.panzoomConfig.scalePerZoomLevel, zoomLevel - this.panzoomConfig.neutralZoomLevel);
  }



}


