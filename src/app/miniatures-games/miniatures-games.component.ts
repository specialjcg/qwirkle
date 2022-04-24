import {Component, Input, OnInit} from '@angular/core';
import {TileFront, toNameImage, toPlate} from "../../domain/Tile";
import HttpTileRepositoryService from "../../infra/httpRequest/http-tile-repository.service";

@Component({
  selector: 'app-miniatures-games',
  templateUrl: './miniatures-games.component.html',
  styleUrls: ['./miniatures-games.component.css']
})
export class MiniaturesGamesComponent implements OnInit {
  @Input() board:number=0;


  plate: TileFront[][] = [[]];
  transform="scale(0.3)";
  constructor(public service: HttpTileRepositoryService) { }

  ngOnInit(): void {
    this.service.getGame(this.board).then((board) =>
    {
    this.plate = toPlate(board.boards);
      let width =document.getElementById("scene")!.clientWidth;
      let height =document.getElementById("scene")!.clientHeight;
      let largeur=(this.getXmax(board.boards) - this.getXmin(board.boards)) * 100;
      let hauteur=(this.getYmax(board.boards) - this.getYmin(board.boards)) * 100;
      let scale=width/largeur
      let translateX=width/largeur*35;
      let translateY=width/largeur*15;

      if (largeur<hauteur){
       scale= height/hauteur
        translateX=width/largeur;
        translateY=height/hauteur*10;
      }

      this.transform = "translate(-"+translateX+"%, -"+translateY+"%) scale(" + scale*.5+ ")";
    });

  }
  getXmin(board:TileFront[]) {
    return Math.min(...board.map((tile) => tile.x));
  }

  getYmin(board:TileFront[]): number {
    return Math.min(...board.map((tile) => tile.y));
  }

  getYmax(board:TileFront[]): number {
    return Math.max(...board.map((tile) => tile.y));
  }

  getXmax(board:TileFront[]): number {
    return Math.max(...board.map((tile) => tile.x));
  }



  getLineStyle(line: TileFront[], index: number): string {
    if (line[0] !== undefined) {
      return 'translate(' + 0 + 'px,' + index * 100 + 'px)';
    }
    return '';
  }
  getRackTileImage(tile: TileFront): string {
    return '../../assets/img/' + toNameImage(tile);
  }



}
