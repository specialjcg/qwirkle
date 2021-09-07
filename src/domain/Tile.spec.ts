import {
  changePosition,
  firstPosition,
  insertPosition,
  lastPosition,
  setPosition,
  Tile,
  toNameImage,
  toPlate
} from './Tile';
import {Form} from './Form';

import {Color} from './Color';





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
    expect(toNameImage(tile)).toEqual('PurpleCircle.png');
  });
  it('should add tile in row at position x=0 and y=0', () => {
    const tile: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    expect(setPosition([], tile)).toEqual([{id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true}]);
  });
  it('should add tile in row at position x=1 and y=0', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, form: Form.Square, color: Color.Purple, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPosition([], tileOne);
    const newRowTile = setPosition(rowTile, tileTwo);
    expect(newRowTile).toEqual([{id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true}]);
  });
  it('should add tile in row at position x=1 and y=0', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: 1, y: 0, disabled: true};
    const rowTile: Tile[] = setPosition( [tileOne], tileTwo);
    expect(rowTile).toEqual([{id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true},
      {id: 2, form: Form.Circle, color: Color.Red, x: 1, y: 0, disabled: true}]);
  });
  it('should add tile in row at position x=-1 and y=0 ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const rowTile: Tile[] = setPosition( [tileOne], tileTwo);
    expect(rowTile).toEqual([{id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true},
      {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true}
      ]);
  });
  it('should inverse position of  two tile in row ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const rowTile: Tile[] = setPosition( [tileOne], tileTwo);
    const newRowTile: Tile[] = changePosition( rowTile, tileOne, tileTwo.x, tileOne.y);
    expect(newRowTile).toEqual([{id: 1, form: Form.Circle, color: Color.Purple, x: -1, y: 0, disabled: true},
      {id: 2, form: Form.Circle, color: Color.Red, x: 0, y: 0, disabled: true},

    ]);
  });
  it('should insert a tile between  two tile in row ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const tileinsert: Tile = {id: 3, form: Form.Square, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPosition( [tileOne], tileTwo);
    const newRowTile: Tile[] = insertPosition( rowTile, tileinsert, 0, 0);
    expect(newRowTile).toEqual([{id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true},
      {id: 3, form: Form.Square, color: Color.Red, x: 0, y: 0, disabled: true},
      {id: 1, form: Form.Circle, color: Color.Purple, x: 1, y: 0, disabled: true}
    ]);
  });
  it('should insert a tile in first before  two tile in row ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const tileinsert: Tile = {id: 3, form: Form.Square, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPosition( [tileOne], tileTwo);
    const newRowTile: Tile[] = firstPosition( rowTile, tileinsert);
    expect(newRowTile).toEqual([{id: 3, form: Form.Square, color: Color.Red, x: -2, y: 0, disabled: true},
      {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true},

      {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true}
    ]);
  });
  it('should insert a tile in last after  two tile in row ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true};
    const tileinsert: Tile = {id: 3, form: Form.Square, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPosition( [tileOne], tileTwo);
    const newRowTile: Tile[] = lastPosition( rowTile, tileinsert);
    expect(newRowTile).toEqual([
      {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: true},

      {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: true},
      {id: 3, form: Form.Square, color: Color.Red, x: 1, y: 0, disabled: true}
    ]);
  });
  it('should insert a tile in first when 3 tiles are disable to false ', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: false};
    const tiletree: Tile = {id: 3, form: Form.EightPointStar, color: Color.Red, x: -2, y: 0, disabled: false};
    const tileinsert: Tile = {id: 4, form: Form.Square, color: Color.Red, x: 0, y: 0, disabled: true};
    const rowTile: Tile[] = setPosition( [tileOne], tileTwo);
    const overrowTile: Tile[] = setPosition( rowTile, tiletree);

    const newRowTile: Tile[] = insertPosition( overrowTile, tileinsert, -1, 0);
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
    const rowTile: Tile[] = setPosition( [tileOne], tileTwo);
    const overrowTile: Tile[] = setPosition( rowTile, tiletree);

    const newRowTile: Tile[] = insertPosition( overrowTile, tileinsert, 0,0);
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
    let rowTile: Tile[] = setPosition( [tileOne], tileTwo);
    rowTile = setPosition( rowTile, tiletree);
    rowTile = setPosition( rowTile, tilefour);


    const newRowTile: Tile[] = insertPosition( rowTile, tileinsert, 0, 0);

    expect(newRowTile).toEqual([ {id: 4, form: Form.Square, color: Color.Red, x: 0, y: -1, disabled: false},
      {id: 3, form: Form.EightPointStar, color: Color.Red, x: 1, y: -1, disabled: false},
      {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: false},
     {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false},

      {id: 5, form: Form.Clover, color: Color.Red, x: 1, y: 0, disabled: true},



    ]);
  });
  it('should transform board from API to plate for Droplist', () => {
    const tileOne: Tile = {id: 1, form: Form.Circle, color: Color.Purple, x: 0, y: 0, disabled: false};
    const tileTwo: Tile = {id: 2, form: Form.Circle, color: Color.Red, x: -1, y: 0, disabled: false};
    const tiletree: Tile = {id: 3, form: Form.EightPointStar, color: Color.Red, x: 1, y: -1, disabled: false};
    const tilefour: Tile = {id: 4, form: Form.Square, color: Color.Red, x: 0, y: -1, disabled: false};
    let rowTile: Tile[] = setPosition( [tileOne], tileTwo);
    rowTile = setPosition( rowTile, tiletree);
    rowTile = setPosition( rowTile, tilefour);
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
});
