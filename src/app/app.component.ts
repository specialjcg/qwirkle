import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SignalRService} from '../infra/httpRequest/services/signal-r.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {changePosition, Tile, toNameImage, toPlate} from '../domain/Tile';
import HttpTileRepositoryService from '../infra/httpRequest/http-tile-repository.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {fromBag, fromBoard, Player, RestTilesPlay, RestTilesSwap, Result} from '../infra/httpRequest/player';
import panzoom from 'panzoom';


const headers = new HttpHeaders()
  .set('Access-Control-Allow-Origin', '*')
  .set('Content-Type', 'application/json; charset=utf-8');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('scene', {static: false}) scene: ElementRef;
  title = 'qwirkle';
  result: Tile[] = [];
  board: Tile[] = [];
  bag: Tile[] = [];
  plate: Tile[][] = [[]];
  playTile: RestTilesPlay[] = [];
  swapTile: RestTilesSwap[] = [];
  panZoomController;
  score: Result ;
  voidTile: Tile[] = [{disabled: false, id: 0, form: 0, color: 0, y: 0, x: 0}];
  totalScore = 0;
  gamedId = 0;
  player: Player = {
    id: 0,
    pseudo: '',
    gameId: 0,
    gamePosition: 0,
    points: 0,
    rack: {tiles: []},
    isTurn: true
  };
  playerNameToPlay: string;
  nameToTurn: string;


  constructor(public signalRService: SignalRService, private http: HttpClient, private serviceQwirkle: HttpTileRepositoryService) {
    this.score = {
      code: 0,
      tilesPlayed: [],
      newRack: [],
      points: 0
    };
  }

  ngOnInit(): void {
    this.signalRService.startConnection();

  }


  ngAfterViewInit(): void {
    this.panZoomController = panzoom(this.scene.nativeElement, {minZoom: 0.5, zoomDoubleClickSpeed: 1});

  }

  autoZoom(): void {
    //
    const topLeft = {x: 0, y: 0};
    this.panZoomController = panzoom(this.scene.nativeElement, {transformOrigin: topLeft, zoomDoubleClickSpeed: 1});
    const shelveDisplay = document.querySelector('.container');
    const xmin: number = Math.min(...this.board.map(tile => tile.x));
    const xmax = Math.max(...this.board.map(tile => tile.x));
    const ymin = Math.min(...this.board.map(tile => tile.y));
    const ymax = Math.max(...this.board.map(tile => tile.y));
    const Xmax = shelveDisplay.clientWidth / (xmax - xmin);
    const Ymax = shelveDisplay.clientHeight / ((ymax - ymin));
    let coef = 0;
    let width = 0;
    let height = 0;
    if ((ymax - ymin) > (xmax - xmin)) {
      coef = Math.abs(shelveDisplay.clientHeight - (80 * (ymax - ymin))) / shelveDisplay.clientHeight;
      width = shelveDisplay.clientWidth - Math.abs((shelveDisplay.clientWidth - (80 * (xmax - xmin))));
      height = shelveDisplay.clientHeight - Math.abs(shelveDisplay.clientHeight - (80 * (ymax - ymin)));
    } else {
      coef = Math.abs((shelveDisplay.clientWidth - (80 * (ymax - ymin)))) / shelveDisplay.clientWidth;
      width = shelveDisplay.clientWidth - Math.abs((shelveDisplay.clientWidth - (80 * (xmax - xmin))));
      height = shelveDisplay.clientHeight - Math.abs(shelveDisplay.clientHeight - (80 * (ymax - ymin)));
    }
    if ((ymax - ymin) === 0) {
      this.panZoomController.moveTo(shelveDisplay.clientWidth / 10, shelveDisplay.clientHeight);
      this.panZoomController.zoomAbs(0, 0, coef); }
else{
    this.panZoomController.moveTo(width / 2, height);
    this.panZoomController.zoomAbs(0, 0, coef);
  }
  }


  getRackTileImage(tile: Tile): string {

    return '../../assets/img/' + toNameImage(tile);
  }

  getLineStyle(line: Tile[]): string {
    if (line[0] !== undefined) {
      // return 'transform:translateX(' + -line[0].y * 100 + 'px);';
      return 'translate(' + 0 + 'px,' + line[0].y * 100 + 'px)';
      // return '';
    }
    // // if (line[i] !== undefined) { return 'transform:translate(' + 1400 + 'px,' + 500 + 'px);'; }
    // console.log(i);
    // else {
    //   console.log(line, i);
    //   return 'translate(' + 0 + 'px,' + 5 * 100 + 'px)'; }

  }


  drop(event: CdkDragDrop<Tile[], any>, index: number): void {

    this.board = changePosition(this.board, event.previousContainer.data[event.previousIndex],
      this.plate[index][event.currentIndex].x, this.plate[index][event.currentIndex].y);

    if (event.previousContainer === event.container) {


    } else {
      this.result = this.result.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);
      this.validSimulation();

    }
    this.plate = toPlate(this.board);

  }

  dropempty(event: CdkDragDrop<Tile[], any>, index: number): void {
    this.board = changePosition(this.board, event.previousContainer.data[event.previousIndex], 0, 0);
    if (event.previousContainer === event.container) {


    } else {
      this.result = this.result.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);


    }

    this.plate = toPlate(this.board);


  }

  dropInBag(event: CdkDragDrop<Tile[], any>, index: number): void {
    this.board = changePosition(this.bag, event.previousContainer.data[event.previousIndex], 0, 0);
    if (event.previousContainer !== event.container) {
      this.result = this.result.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);
      // attention : le previous peut potentiellement être le board. à gérer dans ce cas et faire filter sur board et non sur result

    }

    this.plate = toPlate(this.board); // j'ai pas bien compris ce que ça fait. a adapter...
  }


  async game(): Promise<void> {
    this.serviceQwirkle.getPlayerNameToPlay(this.gamedId).subscribe(res => {
      this.nameToTurn = res;

    });
    this.player = (await this.serviceQwirkle.getPlayers(this.gamedId)).filter(player => player.isTurn === true)[0];
    this.signalRService.sendPlayerInGame(this.gamedId, this.player.id);
    this.result = this.player.rack.tiles;
    this.board = await this.serviceQwirkle.getGames(this.gamedId);
    this.plate = toPlate(this.board);
    this.autoZoom();
  }

  async valid(): Promise<void> {
    this.playTile = fromBoard(this.board.filter(tile => tile.disabled), this.player.id);
    this.serviceQwirkle.playTile(this.playTile).then((resp) => {
      this.score = resp;

      this.getPlayerIdToPlay().then();
      this.game().then();
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


  countChange(event: number): void {
    this.gamedId = event;
    this.getPlayerIdToPlay().then();

    this.game().then();
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
}


