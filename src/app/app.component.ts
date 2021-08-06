import {Component} from '@angular/core';
import {Tile, toNameImage} from '../domain/Tile';
import HttpTileRepositoryService from '../infra/httpRequest/http-tile-repository.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'qwircle';
  result: Tile[] = [];
  plate: Tile[] = [];
  resultList = [];
  plateList = [];
  getRackTileImage(index: number): string {

    return '../../assets/img/' + toNameImage(this.result[index]);
  }

  getRackTileStyle(index: number): string {
    return '-webkit-transform:rotateX(-32deg) rotateY(78deg); -moz-transform:rotateX(-32deg) rotateY(78deg); -ms-transform:rotateX(-32deg) rotateY(78deg); transform:rotateX(-32deg) rotateY(78deg);';
  }


  constructor(private serviceQwirkle: HttpTileRepositoryService) {

  }

  drop(event: CdkDragDrop<Tile[]>): void{
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

    }
  }
  async game(): Promise<void> {
    this.result = await this.serviceQwirkle.get();
  }
}
