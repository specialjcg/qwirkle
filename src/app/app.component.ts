import {Component} from '@angular/core';
import {Tile, toNameImage} from '../domain/Tile';
import HttpTileRepositoryService from '../infra/httpRequest/http-tile-repository.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
const TILENULL: Tile = {id: 0, form: 0, color: 0};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'qwircle';
   result: Tile[] = [];
  plate: Tile[][] = [[]];

  getRackTileImage(tile: Tile): string {

    return '../../assets/img/' + toNameImage(tile);
  }
  getLineStyle(i: number): string {
    return 'top:' + i * 10 + 'vh';
  }
  getRackTileStyle(): string {
    return '-webkit-transform:rotateX(-32deg) rotateY(78deg); -moz-transform:rotateX(-32deg) rotateY(78deg); -ms-transform:rotateX(-32deg) rotateY(78deg); transform:rotateX(-32deg) rotateY(78deg);';
  }


  constructor(private serviceQwirkle: HttpTileRepositoryService) {

  }

  drop(event: CdkDragDrop<Tile[]>, index: number): void{
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

    }

    if (this.plate[1] === undefined)
    {
      this.plate.splice(0, 0, [TILENULL, TILENULL, TILENULL]);
      this.plate.splice(2, 0, [TILENULL, TILENULL, TILENULL]);
      this.plate[1] = [TILENULL, ...this.plate[1], TILENULL];
    }else if (index === 0){
      this.plate.splice(0, 0, [TILENULL, TILENULL, TILENULL]);
    }else if (event.currentIndex === 0){
      this.plate[index].splice(1, 1);
      this.plate = this.plate.map(tile => [TILENULL, ...tile]);
    }else if (index === this.plate.length - 1){

      this.plate.splice(index + 1, 0, [TILENULL, TILENULL, TILENULL]);
    }
    this.plate = this.plate.map(tile => {
      if (tile[tile.length - 1] === TILENULL && tile[tile.length - 2] === TILENULL && tile[tile.length - 3] !== TILENULL){
        tile.splice(tile.length - 1, 1);
      }
      return [...tile];


      });
    // if (this.plate[index] === [TILENULL]) {
    // this.plate[index] = [...this.plate[index], TILENULL];
    // }
    // else { this.plate[index] = [TILENULL]; }
    // this.plate[index + 1] = event.container.data;
    // if (this.plate[index + 2] === [TILENULL]) {
    //   this.plate[index + 2] = [...this.plate[index + 2], TILENULL];
    // }
    // else { this.plate[index + 2] = [ TILENULL]; }

  }

  async game(): Promise<void> {
    this.result = await this.serviceQwirkle.get();
  }


}
