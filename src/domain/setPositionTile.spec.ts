import {setPositionTile, toTiles} from "./SetPositionTile";
import {Tile} from "./Tile";
import {Shape} from "./Shape";
import {Color} from "./Color";

describe('test toFile', () => {
  it('should return rack tiles to Tile', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, shape: Shape.Square, color: Color.Purple, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile([tileTwo], tileOne);
    expect(toTiles(rowTile)).toEqual([
      {
        "color": 3,
        "id": 2,
        "rackPosition": 0,
        "shape": 2
      }
    ])
  });
});
