import {Component} from '@angular/core';
import {toNameImage} from '../domain/Tile';
import {toWebTiles} from '../infra/httpRequest/restGame';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'qwircle';
  result = [
    {
      id: 5,
      pseudo: null,
      gameId: 5,
      gamePosition: 1,
      points: 0,
      rack: {
        tiles: [
          {
            rackPosition: 5,
            id: 99,
            color: 6,
            form: 6
          },
          {
            rackPosition: 4,
            id: 74,
            color: 1,
            form: 6
          },
          {
            rackPosition: 3,
            id: 5,
            color: 1,
            form: 4
          },
          {
            rackPosition: 2,
            id: 52,
            color: 2,
            form: 4
          },
          {
            rackPosition: 1,
            id: 21,
            color: 4,
            form: 6
          },
          {
            rackPosition: 0,
            id: 102,
            color: 6,
            form: 3
          }
        ]
      },
      isTurn: true
    }
  ];

  getRackTileImage(index: number): string {

    return '../../assets/img/' + toNameImage(toWebTiles(this.result)[index]);
  }

  getRackTileStyle(index: number): string {
    return 'left: ' + (index * 4.5 + 40) + '%;-webkit-transform:rotateX(-32deg) rotateY(78deg); -moz-transform:rotateX(-32deg) rotateY(78deg); -ms-transform:rotateX(-32deg) rotateY(78deg); transform:rotateX(-32deg) rotateY(78deg);';
  }


  game(): void {

  }
}
