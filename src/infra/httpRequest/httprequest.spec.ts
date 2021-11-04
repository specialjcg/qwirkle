import {Player, toWebTiles} from './player';
import {Color} from '../../domain/Color';
import { Shape } from '../../domain/Shape';


describe('Get response from qwirkle api', () => {
  it('should create first Tile from qwirkle Game API ', () => {
    const result: Player[] = [
      {
        id: 5,
        pseudo: '',
        gameId: 5,
        gamePosition: 1,
        lastTurnPoints: 0,
        points: 0,
        rack: {
          tiles: [
            {
              rackPosition: 1,
              id: 99,
              color: 6,
              shape: 6,

            },
            {
              rackPosition: 1,


              id: 74,
              color: 1,
              shape: 6
            },
            {
              rackPosition: 1,
              id: 5,
              color: 1,
              shape: 4
            },
            {
              rackPosition: 1,
              id: 52,
              color: 2,
              shape: 4
            },
            {
              rackPosition: 1,
              id: 21,
              color: 4,
              shape: 6
            },
            {
              rackPosition: 1,
              id: 102,
              color: 6,
              shape: 3
            }
          ]
        },
        isTurn: true
      }
    ];
    console.log(result[0]);
    expect(toWebTiles(result[0])[0]).toEqual({id: 99, color: Color.Yellow, shape: Shape.EightPointStar, disabled: false, x: 0, y: 0});
    expect(toWebTiles(result[0])[1]).toEqual({id: 74, color: Color.Green, shape: Shape.EightPointStar, disabled: false, x: 0, y: 0});

  });

});
