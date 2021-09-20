import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {changePosition, Tile, toNameImage, toPlate} from '../domain/Tile';
import HttpTileRepositoryService from '../infra/httpRequest/http-tile-repository.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {fromBoard, RestTilesPlay, Result} from '../infra/httpRequest/restGame';
import panzoom from 'panzoom';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('scene', {static: false}) scene: ElementRef;
  title = 'qwircle';
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
  gamedId = 1;

  constructor(private serviceQwirkle: HttpTileRepositoryService) {

  }

  ngOnInit(): void {


  }

  ngAfterViewInit(): void {
    this.panZoomController = panzoom(this.scene.nativeElement, {minZoom: 0.5, zoomDoubleClickSpeed: 1});

  }

  autoZoom(): void {
    //
    const topLeft = {x: 0, y: 0};
    this.panZoomController = panzoom(this.scene.nativeElement, {transformOrigin: topLeft, zoomDoubleClickSpeed: 1});
    this.panZoomController.moveTo(-400, -1500);
    // const shelveDesign = document.getElementById('scene');
    // const shelveDisplay = document.querySelector('.container');
    // const MARGELEFT = 50;
    // if (shelveDisplay.clientWidth - MARGELEFT < shelveDesign.offsetWidth) {
    //
    //   this.panZoomController.zoomAbs(0, 0, shelveDisplay.clientWidth / (shelveDesign.offsetWidth + MARGELEFT));
    //
    // } else {
    //
    //   this.panZoomController.zoomAbs(0, 0, 1);
    //
    // }

  }


  getRackTileImage(tile: Tile): string {

    return '../../assets/img/' + toNameImage(tile);
  }

  getLineStyle(line: Tile[], i: number): string {
    if (line[i] !== undefined) { return 'top:' + line[i].y * 140 + 'px'; }
    return '';

  }



  drop(event: CdkDragDrop<Tile[]>, index: number): void {
    this.board = changePosition(this.board, event.previousContainer.data[event.previousIndex],
      this.plate[index][event.currentIndex].x, this.plate[index][event.currentIndex].y);

    if (event.previousContainer === event.container) {


    } else {
      this.result = this.result.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);


    }
    this.plate = toPlate(this.board);


  }

  dropempty(event: CdkDragDrop<Tile[]>, index: number): void {
    this.board = changePosition(this.board, event.previousContainer.data[event.previousIndex], 0, 0);
    if (event.previousContainer === event.container) {


    } else {
      this.result = this.result.filter(tile => tile !== event.previousContainer.data[event.previousIndex]);


    }

    this.plate = toPlate(this.board);


  }

  async game(): Promise<void> {
    this.result = await this.serviceQwirkle.get(this.gamedId);
    const playerId = await this.serviceQwirkle.getPlayerId(this.gamedId);
    this.board = await this.serviceQwirkle.getGames(playerId);
    this.totalScore = await this.serviceQwirkle.getPlayerTotalPoint(this.gamedId);
    this.plate = toPlate(this.board);
    this.autoZoom();

  }

  async valid(): Promise<void> {
    const playerId = this.serviceQwirkle.getPlayerId(this.gamedId);
    this.playTile = fromBoard(this.board.filter(tile => tile.disabled), await playerId);

    this.serviceQwirkle.playTile(this.playTile).then((resp) => {
        this.score = resp;
        this.game().then();
      }
    );

  }


  dropResult(event: CdkDragDrop<Tile[], any>): void {
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
    this.game().then();
  }
}
