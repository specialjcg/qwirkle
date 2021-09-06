import { Component } from '@angular/core';
import { toImageName } from '../domain/Tile';
import { toWebTiles } from '../infra/httpRequest/restGame';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'qwirkle';
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
            form: 1
          },
          {
            rackPosition: 4,
            id: 74,
            color: 1,
            form: 2
          },
          {
            rackPosition: 3,
            id: 5,
            color: 3,
            form: 5
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
            color: 5,
            form: 3
          }
        ]
      },
      isTurn: true
    }
  ];

  getRackTileImage(index: number): string {
    return '../../assets/img/' + toImageName(toWebTiles(this.result)[index]);
  }

  getRackTileStyle(index: number): string {
    return 'left: ' + (40 + index * 4.5) + '%;-webkit-transform:rotateX(-45deg) rotateY(85deg); -moz-transform:rotateX(-45deg) rotateY(85deg); -ms-transform:rotateX(-45deg) rotateY(85deg); transform:rotateX(-45deg) rotateY(85deg);';
  }


  game(): void {

  }
}
