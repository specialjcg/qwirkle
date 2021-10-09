import {
  changePosition,
  insertPosition,
  Tile,
  toNameImage,
  toPlate
} from './Tile';
import {Form} from './Form';
import {Color} from './Color';
import {setPositionTile} from './SetPositionTile';
import {Tiles} from '../infra/httpRequest/tiles';





describe('create tiles list', () => {
  it('should create a tile id', () => {
    const tile: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0 , disabled: true};
    expect(tile.id).toEqual(1);
  });
  it('should create a tile form', () => {
    const tile: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    expect(tile.form).toEqual(Form.Circle);
  });
  it('should create a tile color', () => {
    const tile: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0 , disabled: true};
    expect(tile.color).toEqual(Color.Purple);
  });
  it('should get image name from Tile', () => {
    const tile: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    expect(toNameImage(tile)).toEqual('PurpleCircle.svg');
  });
  it('should add tile in row at position x=0 and y=0', () => {
    const tile: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    expect(setPositionTile([], tile)).toEqual([{id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true}]);
  });
  it('should add tile in row at position x=1 and y=0', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, form: Form.Square, color: Color.Purple, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile([], tileOne);
    const newRowTile = setPositionTile(rowTile, tileTwo);
    expect(newRowTile).toEqual([{id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true}]);
  });
  it('should add tile in row at position x=1 and y=0', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: 1, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile( [tileOne], tileTwo);
    expect(rowTile).toEqual([{id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true},
      {id: 2, form: Form.Circle, color: Color.Red, x: 1, y: 0, disabled: true}]);
  });
  it('should add tile in row at position x=-1 and y=0 ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile( [tileOne], tileTwo);
    expect(rowTile).toEqual([{id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true},
      {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true}
      ]);
  });
  it('should inverse position of  two tile in row ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile( [tileOne], tileTwo);
    const newRowTile: Tile[] = changePosition(rowTile, {id: tileOne.id, rackPosition: 1, form: tileOne.form, color: tileOne.color}, tileTwo.x, 0);
    expect(newRowTile).toEqual([ {id: 1, form: Form.Circle, color: Color.Purple, x: -2, y: 0, disabled: true},
      {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true}
    ]);
  });
  it('should insert a tile between  two tile in row ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const tileinsert: Tile = {id: 3, form: Form.Square, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile( [tileOne], tileTwo);
    const newRowTile: Tile[] = insertPosition(rowTile, tileinsert, 0);
    expect(newRowTile).toEqual([{id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true},
      {id: 3, form: Form.Square, color: Color.Red, x: 0, y: 0, disabled: true},
      {id: 1, form: Form.Circle, color: Color.Purple, x: 1, y: 0, disabled: true}
    ]);
  });


  it('should insert a tile in first when 3 tiles are disable to false ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: false};
    const tiletree: Tile = {id: 3, form: Form.EightPointStar, color: Color.Red, x: -2, y: 0, disabled: false};
    const tileinsert: Tile = {id: 4, form: Form.Square, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile( [tileOne], tileTwo);
    const overrowTile: Tile[] = setPositionTile( rowTile, tiletree);

    const newRowTile: Tile[] = insertPosition(overrowTile, tileinsert, -1);
    expect(newRowTile).toEqual([ {id: 4, form: Form.Square, color: Color.Red, x: -3, y: 0, disabled: true},
      {id: 3, form: Form.EightPointStar, color: Color.Red, x: -2, y: 0, disabled: false},
      {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: false},

      {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false},

    ]);
  });
  it('should insert a tile in last when 3 tiles are disable to false ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: false};
    const tiletree: Tile = {id: 3, form: Form.EightPointStar, color: Color.Red, x: -2, y: 0, disabled: false};
    const tileinsert: Tile = {id: 4, form: Form.Square, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile( [tileOne], tileTwo);
    const overrowTile: Tile[] = setPositionTile( rowTile, tiletree);

    const newRowTile: Tile[] = insertPosition(overrowTile, tileinsert, 0);
    expect(newRowTile).toEqual([
      {id: 3, form: Form.EightPointStar, color: Color.Red, x: -2, y: 0, disabled: false},
      {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: false},

      {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false},
      {id: 4, form: Form.Square, color: Color.Red, x: 1, y: 0, disabled: true},

    ]);
  });
  it('should insert a tile in board  ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: false};
    const tiletree: Tile = {id: 3, form: Form.EightPointStar, color: Color.Red, x: 1, y: -1, disabled: false};
    const tilefour: Tile = {id: 4, form: Form.Square, color: Color.Red, x: 0, y: -1, disabled: false};
    const tileinsert: Tile = {id: 5, form: Form.Clover, color: Color.Red, x: 0, y: 0, disabled: true};
    let rowTile: Tile[] = setPositionTile( [tileOne], tileTwo);
    rowTile = setPositionTile( rowTile, tiletree);
    rowTile = setPositionTile( rowTile, tilefour);


    const newRowTile: Tile[] = insertPosition(rowTile, tileinsert, 0);

    expect(newRowTile).toEqual([ {id: 4, form: Form.Square, color: Color.Red, x: 0, y: -1, disabled: false},
      {id: 3, form: Form.EightPointStar, color: Color.Red, x: 1, y: -1, disabled: false},
      {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: false},
     {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false},

      {id: 5, form: Form.Clover, color: Color.Red, x: 1, y: 0, disabled: true},



    ]);
  });
  it('should insert a tile in board before tile disabled  ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const tileinsert: Tile = {id: 5, form: Form.Clover, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPositionTile( [tileOne], tileTwo);



    const newRowTile: Tile[] = insertPosition(rowTile, tileinsert, 0);

    expect(newRowTile).toEqual([
      {id: 2, form: Form.Circle, color: Color.Red, x: -2, y: 0, disabled: true},
      {id: 5, form: Form.Clover, color: Color.Red, x: -1, y: 0, disabled: true},
      {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false}]);
  });
  it('should insert a tile from line  in board in other line tile ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const tileTree: Tile = {id: 6, form: Form.Square, color: Color.Green, x: 0, y: 0, disabled: true};
    let rowTile: Tile[] = setPositionTile( [tileOne], tileTwo);
    rowTile = setPositionTile( rowTile, tileTree);


    rowTile = changePosition( rowTile, {id: tileTree.id, rackPosition: 1, form: tileTree.form, color: tileTree.color}, 1, -1);



    expect(rowTile).toEqual([{id: 6, form: Form.Square, color: Color.Green, x: 1, y: -1, disabled: true},
      {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true},
      {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false}
      ]);
  });
  it('should return plate emtpy when board is empty', () => {
    const tileOne: Tile[] = [];
    expect(toPlate(tileOne)).toEqual([]);
  });
  it('should transform board from API to plate for Droplist', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: false};
    const tiletree: Tile = {id: 3, form: Form.EightPointStar, color: Color.Red, x: 1, y: -1, disabled: false};
    const tilefour: Tile = {id: 4, form: Form.Square, color: Color.Red, x: 0, y: -1, disabled: false};
    let rowTile: Tile[] = setPositionTile( [tileOne], tileTwo);
    rowTile = setPositionTile( rowTile, tiletree);
    rowTile = setPositionTile( rowTile, tilefour);
    expect(toPlate(rowTile)).toEqual([[
      {
        color: 0,
        disabled: false,
        form: 0,
        id: 0,
        x: -2,
        y: -2
      },
      {
        color: 0,
        disabled: false,
        form: 0,
        id: 0,
        x: -1,
        y: -2
      },
      {
        color: 0,
        disabled: false,
        form: 0,
        id: 0,
        x: 0,
        y: -2
      },
      {
        color: 0,
        disabled: false,
        form: 0,
        id: 0,
        x: 1,
        y: -2
      },
      {
        color: 0,
        disabled: false,
        form: 0,
        id: 0,
        x: 2,
        y: -2
      }
    ],
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -2,
          y: -1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -1,
          y: -1
        },
        {
          color: 4,
          disabled: false,
          form: 2,
          id: 4,
          x: 0,
          y: -1
        },
        {
          color: 4,
          disabled: false,
          form: 6,
          id: 3,
          x: 1,
          y: -1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 2,
          y: -1
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -2,
          y: 0
        },
        {
          color: 4,
          disabled: false,
          form: 1,
          id: 2,
          x: -1,
          y: 0
        },
        {
          color: 3,
          disabled: false,
          form: 1,
          id: 1,
          x: 0,
          y: 0
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 1,
          y: 0
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 2,
          y: 0
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -2,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -1,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 0,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 1,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
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
        form: 6,
        color: 6,
        disabled: false
      },
      {
        x: 5,
        y: 3,
        id: 10,
        form: 5,
        color: 6,
        disabled: false
      },
      {
        x: 2,
        y: 0,
        id: 21,
        form: 6,
        color: 4,
        disabled: false
      },
      {
        x: 3,
        y: 5,
        id: 23,
        form: 4,
        color: 4,
        disabled: false
      },
      {
        x: 2,
        y: 3,
        id: 31,
        form: 2,
        color: 6,
        disabled: false
      },
      {
        x: 3,
        y: 2,
        id: 33,
        form: 6,
        color: 5,
        disabled: false
      },
      {
        x: 2,
        y: 4,
        id: 37,
        form: 2,
        color: 5,
        disabled: false
      },
      {
        x: 0,
        y: 0,
        id: 41,
        form: 4,
        color: 4,
        disabled: false
      },
      {
        x: 3,
        y: -1,
        id: 50,
        form: 1,
        color: 3,
        disabled: false
      },
      {
        x: 1,
        y: 5,
        id: 57,
        form: 5,
        color: 4,
        disabled: false
      },
      {
        x: 1,
        y: 0,
        id: 59,
        form: 3,
        color: 4,
        disabled: false
      },
      {
        x: 2,
        y: 5,
        id: 60,
        form: 2,
        color: 4,
        disabled: false
      },
      {
        x: 2,
        y: -1,
        id: 62,
        form: 6,
        color: 3,
        disabled: false
      },
      {
        x: 0,
        y: 2,
        id: 76,
        form: 4,
        color: 1,
        disabled: false
      },
      {
        x: 1,
        y: -1,
        id: 84,
        form: 3,
        color: 3,
        disabled: false
      },
      {
        x: 3,
        y: 1,
        id: 93,
        form: 6,
        color: 1,
        disabled: false
      },
      {
        x: 0,
        y: 1,
        id: 101,
        form: 4,
        color: 6,
        disabled: false
      },
      {
        x: 4,
        y: 3,
        id: 104,
        form: 1,
        color: 6,
        disabled: false
      },
      {
        x: 2,
        y: 1,
        id: 105,
        form: 6,
        color: 5,
        disabled: false
      }
    ];
    const inserPosition: Tile = {
      id: 0,
      form: 0,
      color: 0,
      x: 3,
      y: -2,
      disabled: false
    };
    const rackTile: Tiles =
    {
      rackPosition : 2,
      id : 61,
      color : 4,
      form : 1
    };
    rowTile = changePosition(rowTile, rackTile,
      inserPosition.x, inserPosition.y);
    expect(toPlate(rowTile)).toEqual([
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -1,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 0,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 1,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 2,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 3,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 4,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 5,
          y: -3
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 6,
          y: -3
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -1,
          y: -2
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 0,
          y: -2
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 1,
          y: -2
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 2,
          y: -2
        },
        {
          color: 4,
          disabled: true,
          form: 1,
          id: 61,
          x: 3,
          y: -2
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 4,
          y: -2
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 5,
          y: -2
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 6,
          y: -2
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -1,
          y: -1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 0,
          y: -1
        },
        {
          color: 3,
          disabled: false,
          form: 3,
          id: 84,
          x: 1,
          y: -1
        },
        {
          color: 3,
          disabled: false,
          form: 6,
          id: 62,
          x: 2,
          y: -1
        },
        {
          color: 3,
          disabled: false,
          form: 1,
          id: 50,
          x: 3,
          y: -1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 4,
          y: -1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 5,
          y: -1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 6,
          y: -1
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -1,
          y: 0
        },
        {
          color: 4,
          disabled: false,
          form: 4,
          id: 41,
          x: 0,
          y: 0
        },
        {
          color: 4,
          disabled: false,
          form: 3,
          id: 59,
          x: 1,
          y: 0
        },
        {
          color: 4,
          disabled: false,
          form: 6,
          id: 21,
          x: 2,
          y: 0
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 3,
          y: 0
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 4,
          y: 0
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 5,
          y: 0
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 6,
          y: 0
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -1,
          y: 1
        },
        {
          color: 6,
          disabled: false,
          form: 4,
          id: 101,
          x: 0,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 1,
          y: 1
        },
        {
          color: 5,
          disabled: false,
          form: 6,
          id: 105,
          x: 2,
          y: 1
        },
        {
          color: 1,
          disabled: false,
          form: 6,
          id: 93,
          x: 3,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 4,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 5,
          y: 1
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 6,
          y: 1
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -1,
          y: 2
        },
        {
          color: 1,
          disabled: false,
          form: 4,
          id: 76,
          x: 0,
          y: 2
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 1,
          y: 2
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 2,
          y: 2
        },
        {
          color: 5,
          disabled: false,
          form: 6,
          id: 33,
          x: 3,
          y: 2
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 4,
          y: 2
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 5,
          y: 2
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 6,
          y: 2
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -1,
          y: 3
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 0,
          y: 3
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 1,
          y: 3
        },
        {
          color: 6,
          disabled: false,
          form: 2,
          id: 31,
          x: 2,
          y: 3
        },
        {
          color: 6,
          disabled: false,
          form: 6,
          id: 9,
          x: 3,
          y: 3
        },
        {
          color: 6,
          disabled: false,
          form: 1,
          id: 104,
          x: 4,
          y: 3
        },
        {
          color: 6,
          disabled: false,
          form: 5,
          id: 10,
          x: 5,
          y: 3
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 6,
          y: 3
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -1,
          y: 4
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 0,
          y: 4
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 1,
          y: 4
        },
        {
          color: 5,
          disabled: false,
          form: 2,
          id: 37,
          x: 2,
          y: 4
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 3,
          y: 4
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 4,
          y: 4
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 5,
          y: 4
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 6,
          y: 4
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -1,
          y: 5
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 0,
          y: 5
        },
        {
          color: 4,
          disabled: false,
          form: 5,
          id: 57,
          x: 1,
          y: 5
        },
        {
          color: 4,
          disabled: false,
          form: 2,
          id: 60,
          x: 2,
          y: 5
        },
        {
          color: 4,
          disabled: false,
          form: 4,
          id: 23,
          x: 3,
          y: 5
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 4,
          y: 5
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 5,
          y: 5
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 6,
          y: 5
        }
      ],
      [
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: -1,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 0,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 1,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 2,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 3,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 4,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 5,
          y: 6
        },
        {
          color: 0,
          disabled: false,
          form: 0,
          id: 0,
          x: 6,
          y: 6
        }
      ]
    ]);
  });
});
