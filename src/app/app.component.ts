import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { SignalRService } from './services/signal-r.service';
import { HttpClient } from '@angular/common/http';
import {changePosition, Tile, toNameImage, toPlate} from '../domain/Tile';
import HttpTileRepositoryService from '../infra/httpRequest/http-tile-repository.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {fromBoard, Player, RestTilesPlay, Result} from '../infra/httpRequest/player';
import panzoom from 'panzoom';
import { HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {HttpHeaders} from '@angular/common/http';
import {Tiles} from '../infra/httpRequest/tiles';
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
  plate: Tile[][] = [[]];
  playTile: RestTilesPlay[] = [];
  panZoomController;
  score: Result = {
    code: 0,
    tilesPlayed: [],
    newRack: [],
    points: 0
  };
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
  public hubConnection: HubConnection;
  public messages: string[] = [];
  public message: string;
  constructor(public signalRService: SignalRService, private http: HttpClient, private serviceQwirkle: HttpTileRepositoryService) {

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
    const Xmax = shelveDisplay.clientWidth / this.plate.length;
    const Ymax = this.plate.length * 100 / shelveDisplay.clientHeight;


    this.panZoomController.zoomAbs(0, 0, 1 - 1 / Ymax);
    this.panZoomController.moveTo( 0,shelveDisplay.clientHeight/2+100*(1 - 1 / Ymax));



  }


  getRackTileImage(tile: Tile): string {

    return '../../assets/img/' + toNameImage(tile);
  }

  getLineStyle(line: Tile[]): string {
    if (line[0] !== undefined) {
      // return 'transform:translateX(' + -line[i].y * 100 + 'px);';
      return 'translate(' + 0 + 'px,' + line[0].y * 100 + 'px)';
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

  async game(): Promise<void> {
    this.player = (await this.serviceQwirkle.getPlayers(this.gamedId)).filter(player => player.id === this.player.id)[0];
    this.result = this.player.rack.tiles;
    this.board = await this.serviceQwirkle.getGames(this.gamedId);

    this.signalRService.sendPlayerInGame(this.player.gameId, this.player.id);

    this.totalScore = await this.serviceQwirkle.getPlayerTotalPoint(this.player.id);
    this.plate = toPlate(this.board);
    this.autoZoom();

  }

  async valid(): Promise<void> {

    this.playTile = fromBoard(this.board.filter(tile => tile.disabled), this.player.id);

    this.serviceQwirkle.playTile(this.playTile).then((resp) => {
        this.score = resp;
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

  }


  countChange(event: number): void {
    this.gamedId = event;
    this.getPlayerIdToPlay().then();
  }

  playerChange(event: Player): void {
    this.player = event;
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
         this.playerNameToPlay = res ;

       });
   }
}


