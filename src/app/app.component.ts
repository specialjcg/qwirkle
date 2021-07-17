import {Component} from '@angular/core';
import {Tile, toNameImage} from '../domain/Tile';
import HttpTileRepositoryService from '../infra/httpRequest/http-tile-repository.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'qwircle';
  result: Tile[] = [];

  getRackTileImage(index: number): string {

    return '../../assets/img/' + toNameImage(this.result[index]);
  }

  getRackTileStyle(index: number): string {
    return 'top:80%;left: ' + (index * 4.5 + 40) + '%;-webkit-transform:rotateX(-32deg) rotateY(78deg); -moz-transform:rotateX(-32deg) rotateY(78deg); -ms-transform:rotateX(-32deg) rotateY(78deg); transform:rotateX(-32deg) rotateY(78deg);';
  }


  constructor(private serviceQwirkle: HttpTileRepositoryService) {

  }

  async game(): Promise<void> {
    this.result = await this.serviceQwirkle.get();
  }
}
