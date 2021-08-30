import {RestGame, toWebTiles} from './restGame';
import {Color} from '../../domain/Color';
import {Form} from '../../domain/Form';
import {Tile} from '../../domain/Tile';
import {HttpClient} from '@angular/common/http';


describe('Get response from qwirkle api', () => {
  it('should create first Tile from qwirkle Game API ', () => {
    const result: RestGame[] = [
      {
        id: 5,
        pseudo: null,
        gameId: 5,
        gamePosition: 1,
        points: 0,
        rack: {
          tiles: [
            {
disabled:true,
              id: 99,
              color: 6,
              form: 6,
              x: 0,
              y: 0
            },
            {disabled:true,
              x: 0,
              y: 0,
              id: 74,
              color: 1,
              form: 6
            },
            {disabled:true,
              x: 0,
              y: 0,
              id: 5,
              color: 1,
              form: 4
            },
            {disabled:true,
              x: 0,
              y: 0,
              id: 52,
              color: 2,
              form: 4
            },
            {disabled:true,
              x: 0,
              y: 0,
              id: 21,
              color: 4,
              form: 6
            },
            {disabled:true,
              x: 0,
              y: 0,
              id: 102,
              color: 6,
              form: 3
            }
          ]
        },
        isTurn: true
      }
    ];
    expect(toWebTiles(result[0])[0]).toEqual({ id: 99, color: Color.Yellow, form: Form.EightPointStar});
    expect(toWebTiles(result[0])[1]).toEqual({ id: 74, color: Color.Green, form: Form.EightPointStar});

  });

});
