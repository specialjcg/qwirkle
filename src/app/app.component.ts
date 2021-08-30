import {Component} from '@angular/core';
import {changePosition, insertPosition, PlayerTile, Tile, toNameImage, toPlate} from '../domain/Tile';
import HttpTileRepositoryService from '../infra/httpRequest/http-tile-repository.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';



const tofront = (item: number, testFrontiere: number[]): boolean => {

  return testFrontiere.reduce((acc, val) => acc || Math.abs(item - val ) <= 1, false);
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'qwircle';
  result: Tile[] = [];
  board: Tile[] = [];
  plate: Tile[][] = [[]];
  playTile: PlayerTile[] = [];

  constructor(private serviceQwirkle: HttpTileRepositoryService) {

  }

  getRackTileImage(tile: Tile): string {

    return '../../assets/img/' + toNameImage(tile);
  }

  getLineStyle(i: number): string {
    return 'top:' + i * 10 + 'vh';
  }

  getRackTileStyle(): string {
    return '-webkit-transform:rotateX(-32deg) rotateY(78deg); -moz-transform:rotateX(-32deg) rotateY(78deg); -ms-transform:rotateX(-32deg) rotateY(78deg); transform:rotateX(-32deg) rotateY(78deg);';
  }

  drop(event: CdkDragDrop<Tile[]>, index: number): void {
    this.board = changePosition(this.board, event.previousContainer.data[event.previousIndex], this.plate[index][event.currentIndex].x, this.plate[index][event.currentIndex].y);

    if (event.previousContainer === event.container) {



      } else {

      event.previousContainer.data[event.previousIndex] = {id: 0
        , form: 0,
        color: 0
        , x: event.previousContainer.data[event.previousIndex].x ,
        y: event.previousContainer.data[event.previousIndex].y , disabled: false};

    }
    this.plate = toPlate(this.board);


  }

  async game(): Promise<void> {
    this.result = await this.serviceQwirkle.get();
    this.board = await this.serviceQwirkle.getGames();
    this.plate = toPlate(this.board);


  }

  valid(): void {
    this.serviceQwirkle.playTile(this.playTile).then();
  }





  dropResult(event: CdkDragDrop<Tile[], any>): void{
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
