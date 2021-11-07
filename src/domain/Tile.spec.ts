import {getInsertTile, insertPosition, onRight, otherTileInRow, Tile, toNameImage, toPlate} from './Tile';
import {Color} from './Color';
import {setPositionTile} from './SetPositionTile';
import {Tiles} from './tiles';
import {Shape} from './Shape';


describe('create tiles list', () => {
  it('should create a tile id', () => {
    const tile: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    expect(tile.id).toEqual(1);
  });
  it('should create a tile shape', () => {
    const tile: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    expect(tile.shape).toEqual(Shape.Circle);
  });
  it('should create a tile color', () => {
    const tile: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    expect(tile.color).toEqual(Color.Purple);
  });
  it('should get image name from Tile', () => {
    const tile: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    expect(toNameImage(tile)).toEqual('PurpleCircle.svg');
  });
  it('should not get image name from Tile when no shape', () => {
    const tile: Tile = {id: 1, shape: 0, color: Color.Purple, x: 0, y: 0, disabled: true};
    expect(toNameImage(tile)).toEqual('');
  });

  it('should add tile in row at position x=0 and y=0', () => {
    const tile: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    expect(setPositionTile([], tile)).toEqual([{
      id: 1,
      shape: Shape.Circle,
      color: Color.Purple,
      x: 0,
      y: 0,
      disabled: true
    }]);
  });
  it('should add tile in row at position x=1 and y=0', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, shape: Shape.Square, color: Color.Purple, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile([], tileOne);
    const newRowTile = setPositionTile(rowTile, tileTwo);
    expect(newRowTile).toEqual([{id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true}]);
  });
  it('should add tile in row at position x=1 and y=0', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: 1, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile([tileOne], tileTwo);
    expect(rowTile).toEqual([{id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true},
      {id: 2, shape: Shape.Circle, color: Color.Red, x: 1, y: 0, disabled: true}]);
  });
  it('should add tile in row at position x=-1 and y=0 ', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile([tileOne], tileTwo);
    expect(rowTile).toEqual([{id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: true},
      {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true}
    ]);
  });
  it('should not add tile in row at position x=-1 and tileinsert y !== row ', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: -1, disabled: true};
    const rowTile: Tile[] = setPositionTile([tileOne], tileTwo);
    expect(rowTile).toEqual([
      {
        color: 4,
        disabled: true,
        id: 2,
        shape: 1,
        x: -1,
        y: -1
      },
      {
        color: 3,
        disabled: true,
        id: 1,
        shape: 1,
        x: 0,
        y: 0
      }
    ]);
  });
  it('should inverse position of  two tile in row ', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile([tileOne], tileTwo);

    const newRowTile: Tile[] = insertPosition(rowTile, getInsertTile({
      id: tileOne.id,
      rackPosition: 1,
      shape: tileOne.shape,
      color: tileOne.color
    }, tileTwo.x, 0), tileTwo.x)

    expect(newRowTile).toEqual([{id: 1, shape: Shape.Circle, color: Color.Purple, x: -2, y: 0, disabled: true},
      {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: true}
    ]);
  });
  it('should insert a tile between  two tile in row ', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const tileinsert: Tile = {id: 3, shape: Shape.Square, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile([tileOne], tileTwo);
    const newRowTile: Tile[] = insertPosition(rowTile, tileinsert, 0);
    expect(newRowTile).toEqual([{id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: true},
      {id: 3, shape: Shape.Square, color: Color.Red, x: 0, y: 0, disabled: true},
      {id: 1, shape: Shape.Circle, color: Color.Purple, x: 1, y: 0, disabled: true}
    ]);
  });
  it('should insert a tile on two tile in row  and after to up the row', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: false};
    const tileinsert: Tile = {id: 3, shape: Shape.Square, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile([tileOne], tileTwo);
    const newRowTile: Tile[] = insertPosition(rowTile, tileinsert, 0);
    expect(newRowTile).toEqual([
      {
        color: 4,
        disabled: false,
        id: 2,
        shape: 1,
        x: -1,
        y: 0
      },
      {
        color: 3,
        disabled: false,
        id: 1,
        shape: 1,
        x: 0,
        y: 0
      },
      {
        color: 4,
        disabled: true,
        id: 3,
        shape: 2,
        x: 1,
        y: 0
      }
    ]);
    const newRowTile2: Tile[] = insertPosition(newRowTile, getInsertTile({
      id: tileinsert.id,
      rackPosition: 1,
      shape: tileinsert.shape,
      color: tileinsert.color
    }, tileinsert.x, 1), tileinsert.x)

    expect(newRowTile2).toEqual([
      {
        color: 4,
        disabled: false,
        id: 2,
        shape: 1,
        x: -1,
        y: 0
      },
      {
        color: 3,
        disabled: false,
        id: 1,
        shape: 1,
        x: 0,
        y: 0
      },
      {
        color: 4,
        disabled: true,
        id: 3,
        shape: 2,
        x: 0,
        y: 1
      }
    ]);
  });
  it('should not insert a tile between  two tile in row if disabled to false', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const tileinsert: Tile = {id: 3, shape: Shape.Square, color: Color.Red, x: 1, y: 0, disabled: false};
    const rowTile: Tile[] = setPositionTile([tileOne], tileTwo);
    const newRowTile: Tile[] = insertPosition(rowTile, tileinsert, 0);
    expect(newRowTile).toEqual(rowTile);
  });
  it('should not insert a tile between  two tile in row  with same id', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const tileinsert: Tile = {id: 1, shape: Shape.Square, color: Color.Red, x: 1, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile([tileOne], tileTwo);
    const newRowTile: Tile[] = insertPosition(rowTile, tileinsert, 0);
    expect(newRowTile).toEqual([
      {
        "color": 4,
        "disabled": true,
        "id": 2,
        "shape": 1,
        "x": -1,
        "y": 0
      },
      {
        "color": 4,
        "disabled": true,
        "id": 1,
        "shape": 2,
        "x": 0,
        "y": 0
      }
    ]);
  });

  it('should not insert a tile between  two tile in row if y not   the same ', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 1, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: 2, y: 1, disabled: true};
    const newRowTile: boolean = onRight(tileOne, 0, tileTwo);
    expect(newRowTile).toEqual(false);
  });
  it('should not insert a tile between  two tile in row if id is the same ', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 1, y: 0, disabled: true};
    const tileTwo: Tile = {id: 1, shape: Shape.Circle, color: Color.Red, x: 2, y: 0, disabled: true};
    const newRowTile: boolean = otherTileInRow(tileOne)(tileTwo);
    expect(newRowTile).toEqual(false);
  });
  it('should insert a tile in first when 3 tiles are disable to false ', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: false};
    const tiletree: Tile = {id: 3, shape: Shape.EightPointStar, color: Color.Red, x: -2, y: 0, disabled: false};
    const tileinsert: Tile = {id: 4, shape: Shape.Square, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile([tileOne], tileTwo);
    const overrowTile: Tile[] = setPositionTile(rowTile, tiletree);

    const newRowTile: Tile[] = insertPosition(overrowTile, tileinsert, -1);
    expect(newRowTile).toEqual([{id: 4, shape: Shape.Square, color: Color.Red, x: -3, y: 0, disabled: true},
      {id: 3, shape: Shape.EightPointStar, color: Color.Red, x: -2, y: 0, disabled: false},
      {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: false},

      {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: false},

    ]);
  });
  it('should insert a tile in last when 3 tiles are disable to false ', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: false};
    const tiletree: Tile = {id: 3, shape: Shape.EightPointStar, color: Color.Red, x: -2, y: 0, disabled: false};
    const tileinsert: Tile = {id: 4, shape: Shape.Square, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile([tileOne], tileTwo);
    const overrowTile: Tile[] = setPositionTile(rowTile, tiletree);

    const newRowTile: Tile[] = insertPosition(overrowTile, tileinsert, 0);
    expect(newRowTile).toEqual([
      {id: 3, shape: Shape.EightPointStar, color: Color.Red, x: -2, y: 0, disabled: false},
      {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: false},

      {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: false},
      {id: 4, shape: Shape.Square, color: Color.Red, x: 1, y: 0, disabled: true},

    ]);
  });
  it('should insert a tile in board  ', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: false};
    const tiletree: Tile = {id: 3, shape: Shape.EightPointStar, color: Color.Red, x: 1, y: -1, disabled: false};
    const tilefour: Tile = {id: 4, shape: Shape.Square, color: Color.Red, x: 0, y: -1, disabled: false};
    const tileinsert: Tile = {id: 5, shape: Shape.Clover, color: Color.Red, x: 0, y: 0, disabled: true};
    let rowTile: Tile[] = setPositionTile([tileOne], tileTwo);
    rowTile = setPositionTile(rowTile, tiletree);
    rowTile = setPositionTile(rowTile, tilefour);


    const newRowTile: Tile[] = insertPosition(rowTile, tileinsert, 0);

    expect(newRowTile).toEqual([{id: 4, shape: Shape.Square, color: Color.Red, x: 0, y: -1, disabled: false},
      {id: 3, shape: Shape.EightPointStar, color: Color.Red, x: 1, y: -1, disabled: false},
      {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: false},
      {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: false},

      {id: 5, shape: Shape.Clover, color: Color.Red, x: 1, y: 0, disabled: true},


    ]);
  });
  it('should insert a tile in board before tile disabled  ', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const tileinsert: Tile = {id: 5, shape: Shape.Clover, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile([tileOne], tileTwo);


    const newRowTile: Tile[] = insertPosition(rowTile, tileinsert, 0);

    expect(newRowTile).toEqual([
      {id: 2, shape: Shape.Circle, color: Color.Red, x: -2, y: 0, disabled: true},
      {id: 5, shape: Shape.Clover, color: Color.Red, x: -1, y: 0, disabled: true},
      {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: false}]);
  });
  it('should insert a tile from line  in board in other line tile ', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const tileTree: Tile = {id: 6, shape: Shape.Square, color: Color.Green, x: 0, y: 0, disabled: true};
    let rowTile: Tile[] = setPositionTile([tileOne], tileTwo);
    rowTile = setPositionTile(rowTile, tileTree);


    rowTile = insertPosition(rowTile, getInsertTile({
      id: tileTree.id,
      rackPosition: 1,
      shape: tileTree.shape,
      color: tileTree.color
    }, 1, -1), 1);

    expect(rowTile).toEqual([{id: 6, shape: Shape.Square, color: Color.Green, x: 1, y: -1, disabled: true},
      {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: true},
      {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: false}
    ]);
  });
  it('should return plate emtpy when board is empty', () => {
    const tileOne: Tile[] = [];
    expect(toPlate(tileOne)).toEqual([]);
  });
  it('should transshape board from API to plate for Droplist', () => {
    const tileOne: Tile = {id: 1, shape: Shape.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, shape: Shape.Circle, color: Color.Red, x: -1, y: 0, disabled: false};
    const tiletree: Tile = {id: 3, shape: Shape.EightPointStar, color: Color.Red, x: 1, y: -1, disabled: false};
    const tilefour: Tile = {id: 4, shape: Shape.Square, color: Color.Red, x: 0, y: -1, disabled: false};
    let rowTile: Tile[] = setPositionTile([tileOne], tileTwo);
    rowTile = setPositionTile(rowTile, tiletree);
    rowTile = setPositionTile(rowTile, tilefour);
    expect(toPlate(rowTile)).toEqual([[
      {
        color: 0,
        disabled: false,
        shape: 0,
        id: 0,
        x: -2,
        y: -2
      },
      {
        color: 0,
        disabled: false,
        shape: 0,
        id: 0,
        x: -1,
        y: -2
      },
      {
        color: 0,
        disabled: false,
        shape: 0,
        id: 0,
        x: 0,
        y: -2
      },
      {
        color: 0,
        disabled: false,
        shape: 0,
        id: 0,
        x: 1,
        y: -2
      },
      {
        color: 0,
        disabled: false,
        shape: 0,
        id: 0,
        x: 2,
        y: -2
      }
    ],
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -2,
          y: -1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -1,
          y: -1
        },
        {
          color: 4,
          disabled: false,
          shape: 2,
          id: 4,
          x: 0,
          y: -1
        },
        {
          color: 4,
          disabled: false,
          shape: 6,
          id: 3,
          x: 1,
          y: -1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 2,
          y: -1
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -2,
          y: 0
        },
        {
          color: 4,
          disabled: false,
          shape: 1,
          id: 2,
          x: -1,
          y: 0
        },
        {
          color: 3,
          disabled: false,
          shape: 1,
          id: 1,
          x: 0,
          y: 0
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 1,
          y: 0
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 2,
          y: 0
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -2,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -1,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 0,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 1,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 2,
          y: 1
        }
      ]
    ]);
  });
  it('should fix insert tile on board at top ', () => {
    let rowTile: Tile[] = [
      {
        x: 3,
        y: 3,
        id: 9,
        shape: 6,
        color: 6,
        disabled: false
      },
      {
        x: 5,
        y: 3,
        id: 10,
        shape: 5,
        color: 6,
        disabled: false
      },
      {
        x: 2,
        y: 0,
        id: 21,
        shape: 6,
        color: 4,
        disabled: false
      },
      {
        x: 3,
        y: 5,
        id: 23,
        shape: 4,
        color: 4,
        disabled: false
      },
      {
        x: 2,
        y: 3,
        id: 31,
        shape: 2,
        color: 6,
        disabled: false
      },
      {
        x: 3,
        y: 2,
        id: 33,
        shape: 6,
        color: 5,
        disabled: false
      },
      {
        x: 2,
        y: 4,
        id: 37,
        shape: 2,
        color: 5,
        disabled: false
      },
      {
        x: 0,
        y: 0,
        id: 41,
        shape: 4,
        color: 4,
        disabled: false
      },
      {
        x: 3,
        y: -1,
        id: 50,
        shape: 1,
        color: 3,
        disabled: false
      },
      {
        x: 1,
        y: 5,
        id: 57,
        shape: 5,
        color: 4,
        disabled: false
      },
      {
        x: 1,
        y: 0,
        id: 59,
        shape: 3,
        color: 4,
        disabled: false
      },
      {
        x: 2,
        y: 5,
        id: 60,
        shape: 2,
        color: 4,
        disabled: false
      },
      {
        x: 2,
        y: -1,
        id: 62,
        shape: 6,
        color: 3,
        disabled: false
      },
      {
        x: 0,
        y: 2,
        id: 76,
        shape: 4,
        color: 1,
        disabled: false
      },
      {
        x: 1,
        y: -1,
        id: 84,
        shape: 3,
        color: 3,
        disabled: false
      },
      {
        x: 3,
        y: 1,
        id: 93,
        shape: 6,
        color: 1,
        disabled: false
      },
      {
        x: 0,
        y: 1,
        id: 101,
        shape: 4,
        color: 6,
        disabled: false
      },
      {
        x: 4,
        y: 3,
        id: 104,
        shape: 1,
        color: 6,
        disabled: false
      },
      {
        x: 2,
        y: 1,
        id: 105,
        shape: 6,
        color: 5,
        disabled: false
      }
    ];
    const inserPosition: Tile = {
      id: 0,
      shape: 0,
      color: 0,
      x: 3,
      y: -2,
      disabled: false
    };
    const rackTile: Tiles =
      {
        rackPosition: 2,
        id: 61,
        color: 4,
        shape: 1
      };

    rowTile = insertPosition(rowTile, getInsertTile(rackTile,
      inserPosition.x, inserPosition.y), inserPosition.x);
    expect(toPlate(rowTile)).toEqual([
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -1,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 0,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 1,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 2,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 3,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 4,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 5,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 6,
          y: -3
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -1,
          y: -2
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 0,
          y: -2
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 1,
          y: -2
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 2,
          y: -2
        },
        {
          color: 4,
          disabled: true,
          shape: 1,
          id: 61,
          x: 3,
          y: -2
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 4,
          y: -2
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 5,
          y: -2
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 6,
          y: -2
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -1,
          y: -1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 0,
          y: -1
        },
        {
          color: 3,
          disabled: false,
          shape: 3,
          id: 84,
          x: 1,
          y: -1
        },
        {
          color: 3,
          disabled: false,
          shape: 6,
          id: 62,
          x: 2,
          y: -1
        },
        {
          color: 3,
          disabled: false,
          shape: 1,
          id: 50,
          x: 3,
          y: -1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 4,
          y: -1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 5,
          y: -1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 6,
          y: -1
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -1,
          y: 0
        },
        {
          color: 4,
          disabled: false,
          shape: 4,
          id: 41,
          x: 0,
          y: 0
        },
        {
          color: 4,
          disabled: false,
          shape: 3,
          id: 59,
          x: 1,
          y: 0
        },
        {
          color: 4,
          disabled: false,
          shape: 6,
          id: 21,
          x: 2,
          y: 0
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 3,
          y: 0
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 4,
          y: 0
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 5,
          y: 0
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 6,
          y: 0
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -1,
          y: 1
        },
        {
          color: 6,
          disabled: false,
          shape: 4,
          id: 101,
          x: 0,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 1,
          y: 1
        },
        {
          color: 5,
          disabled: false,
          shape: 6,
          id: 105,
          x: 2,
          y: 1
        },
        {
          color: 1,
          disabled: false,
          shape: 6,
          id: 93,
          x: 3,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 4,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 5,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 6,
          y: 1
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -1,
          y: 2
        },
        {
          color: 1,
          disabled: false,
          shape: 4,
          id: 76,
          x: 0,
          y: 2
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 1,
          y: 2
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 2,
          y: 2
        },
        {
          color: 5,
          disabled: false,
          shape: 6,
          id: 33,
          x: 3,
          y: 2
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 4,
          y: 2
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 5,
          y: 2
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 6,
          y: 2
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -1,
          y: 3
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 0,
          y: 3
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 1,
          y: 3
        },
        {
          color: 6,
          disabled: false,
          shape: 2,
          id: 31,
          x: 2,
          y: 3
        },
        {
          color: 6,
          disabled: false,
          shape: 6,
          id: 9,
          x: 3,
          y: 3
        },
        {
          color: 6,
          disabled: false,
          shape: 1,
          id: 104,
          x: 4,
          y: 3
        },
        {
          color: 6,
          disabled: false,
          shape: 5,
          id: 10,
          x: 5,
          y: 3
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 6,
          y: 3
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -1,
          y: 4
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 0,
          y: 4
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 1,
          y: 4
        },
        {
          color: 5,
          disabled: false,
          shape: 2,
          id: 37,
          x: 2,
          y: 4
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 3,
          y: 4
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 4,
          y: 4
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 5,
          y: 4
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 6,
          y: 4
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -1,
          y: 5
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 0,
          y: 5
        },
        {
          color: 4,
          disabled: false,
          shape: 5,
          id: 57,
          x: 1,
          y: 5
        },
        {
          color: 4,
          disabled: false,
          shape: 2,
          id: 60,
          x: 2,
          y: 5
        },
        {
          color: 4,
          disabled: false,
          shape: 4,
          id: 23,
          x: 3,
          y: 5
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 4,
          y: 5
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 5,
          y: 5
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 6,
          y: 5
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: -1,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 0,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 1,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 2,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 3,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 4,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 5,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          shape: 0,
          id: 0,
          x: 6,
          y: 6
        }
      ]
    ]);
  });
});
