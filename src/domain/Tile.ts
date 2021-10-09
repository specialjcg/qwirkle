import {Form} from './Form';
import {Color} from './Color';
import {setPositionTile} from './SetPositionTile';
import {positionIsNotFree} from './PositionIsFree';
import {Tiles} from '../infra/httpRequest/tiles';

export type Tile = {
  disabled: boolean;
  readonly id: number,
  readonly form: Form,
  readonly color: Color,
  readonly y: number,
  readonly x: number,
};


export const toNameImage = (tile: Tile) => tile.form === 0 ? '' : Object.keys(Color)[Object.values(Color).indexOf(tile.color)] +
  Object.keys(Form)[Object.values(Form).indexOf(tile.form)] + '.svg';

export type PlayerTile = {
  playerId: number,
  tileId: number,
  x: number,
  y: number

};


const shiftToRight = (tile: Tile): Tile => ({
  id: tile.id, form: tile.form,
  color: tile.color, x: tile.x - 1,
  y: tile.y, disabled: true
});

const tileAfterNewTile = (tile: Tile, xposition: number, newTile: Tile): boolean =>
  tile.x >= xposition && tile.y === newTile.y;

const shiftToLeft = (tile: Tile): Tile => ({
  id: tile.id, form: tile.form,
  color: tile.color, x: tile.x + 1,
  y: tile.y, disabled: true
});

const otherTileInRow = (tileInsert: Tile) => tile => tile.id !== tileInsert.id && tileInsert.y === tile.y;

const tileNotInRow = (tileInsert: Tile) => tile => tileInsert.y !== tile.y;

const isUnderPosition = (xposition: number) => tile => tile.x < xposition ;

export const insertPosition = (nexTiles: Tile[], tileInsert: Tile, xposition: number): Tile[] => {
  let rowTile = nexTiles.filter(otherTileInRow(tileInsert));

  const rowTilenotInsert = nexTiles.filter(tileNotInRow(tileInsert));
  let newTile = {
    id: tileInsert.id, form: tileInsert.form, color: tileInsert.color, x: xposition,
    y: tileInsert.y, disabled: true
  };
  if (positionIsNotFree(rowTile, newTile)) {
    const before = rowTile.filter(isUnderPosition(xposition));
    const after = rowTile.filter(tile => tileAfterNewTile(tile, xposition, newTile));

    if (before.length > 0 && after[0].disabled) {
      rowTile = rowTile.map(tile => {
        if (tileAfterNewTile(tile, xposition, newTile)) {
          return shiftToLeft(tile);
        }
        return tile;
      });


    } else if (before[0] !== undefined && before[before.length - 1].disabled) {
      rowTile = rowTile.map(tile => {
        if (isUnderPosition(xposition) && tile.disabled) {
          return shiftToRight(tile);
        }
        return tile;
      });
      newTile = shiftToRight(newTile);

    } else {
      if (before.length >= after.length) {
        const xmax = Math.max(...rowTile.map(max => max.x));
        newTile = {
          id: tileInsert.id, form: tileInsert.form, color: tileInsert.color, x: xmax + 1,
          y: tileInsert.y, disabled: true
        };
      } else {
        const xmin = Math.min(...rowTile.map(min => min.x));

        newTile = {
          id: tileInsert.id, form: tileInsert.form, color: tileInsert.color, x: xmin - 1,
          y: tileInsert.y, disabled: true
        };
      }
    }
  }
  return setPositionTile([...rowTilenotInsert, ...rowTile].filter(tile => tile.id !== newTile.id), newTile);
};
export const changePosition = (rowTile: Tile[], tileInsert: Tiles, xposition: number, yposition: number): Tile[] => {
  const insertTile: Tile = {
    id: tileInsert.id, form: tileInsert.form, color: tileInsert.color, x: xposition,
    y: yposition, disabled: true
  };
  return insertPosition(rowTile, insertTile, xposition);
};


export const toPlate = (rowTile: Tile[]): Tile[][] => {
  const xmin: number = Math.min(...rowTile.map(tile => tile.x));
  const xmax = Math.max(...rowTile.map(tile => tile.x));
  const ymin = Math.min(...rowTile.map(tile => tile.y));
  const ymax = Math.max(...rowTile.map(tile => tile.y));
  let coordx = [];
  for (let k = xmin - 1; k <= xmax + 1; k++) {
    coordx = [...coordx, k];
  }
  let coordy = [];
  for (let k = ymin - 1; k <= ymax + 1; k++) {
    coordy = [...coordy, k];
  }
  const result: Tile[][] = Array(coordy.length).fill(null).map((_, indexY) =>

    Array(coordx.length).fill(null).map((_, indexX) =>
      ({
        id: 0, form: 0, color: 0, x: coordx[indexX],
        y: coordy[indexY], disabled: false
      })));

  for (const tile of rowTile) {
    let i = 0;
    for (const tileResult of result) {
      let j = 0;

      for (const tileCurrent of tileResult) {

        if (tile.x === tileCurrent.x && tile.y === tileCurrent.y) {
          result[i][j] = tile;
        }
        j++;
      }
      i++;
    }
  }
  return result;
};
