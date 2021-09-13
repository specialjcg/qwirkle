import {Form} from './Form';
import {Color} from './Color';

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
export const positionIsFree =
  (tiles: Tile[], newTile: { form: Form; color: Color; x: number; y: number; disabled: boolean; id: number }): boolean =>
    tiles.filter(tile =>  tile.x === newTile.x && tile.y === newTile.y || tile.id === newTile.id ).length === 0;

export const setPosition = (tiles: Tile[], tile: Tile): Tile[] => {
  const newTile = {id: tile.id, form: tile.form, color: tile.color, x: tile.x, y: tile.y, disabled: tile.disabled};
  if (positionIsFree(tiles, newTile)){
    return [...tiles, newTile].sort((firstTile, secondTile) =>
      (firstTile.y - secondTile.y) || (firstTile.x - secondTile.x));

       }

  return [...tiles]; };



export const insertPosition = (rowTile: Tile[], tileInsert: Tile, xposition: number, yposition: number): Tile[] => {
  let newTile = {id: tileInsert.id, form: tileInsert.form, color: tileInsert.color, x: xposition,
    y: yposition, disabled: true};
  if (!positionIsFree(rowTile, newTile)) {
    const before = rowTile.filter(tile => tile.x < xposition && tile.y === newTile.y);
    const after = rowTile.filter(tile => tile.x >= xposition && tile.y === newTile.y);

    if (before.length > 0 && after[0].disabled ){
      rowTile = rowTile.map(tile => {if (tile.x >= xposition && tile.y === newTile.y ){
        return {id: tile.id, form: tile.form,
          color: tile.color, x: tile.x + 1,
          y: tile.y, disabled: true}; }
      else { return tile; }});


    }else if (before[0] !== undefined && before[before.length - 1].disabled){
      rowTile = rowTile.map(tile => {if (tile.x >= xposition && tile.y === newTile.y){
        return {id: tile.id, form: tile.form,
          color: tile.color, x: tile.x - 1,
          y: tile.y, disabled: true}; }
      else { return tile; }});


    }
    else{
    if (before.length >= after.length) {
      const xmax = Math.max(...rowTile.filter(tile => tile.y === newTile.y).map(max => max.x));
      newTile = {
        id: tileInsert.id, form: tileInsert.form, color: tileInsert.color, x: xmax + 1,
        y: yposition, disabled: true
      };
    } else {
      const xmin = Math.min(...rowTile.filter(tile => tile.y === newTile.y).map(min => min.x));

      newTile = {
        id: tileInsert.id, form: tileInsert.form, color: tileInsert.color, x: xmin - 1,
        y: yposition, disabled: true
      };
    }
  }}
  return setPosition(rowTile, newTile);
};
export const changePosition = (rowTile: Tile[], tileInsert: Tile, xposition: number, yposition: number): Tile[] => {

  const nexTiles = rowTile.filter(tile => tile.id !== tileInsert.id);
  return insertPosition(nexTiles, tileInsert, xposition, yposition);
};
export const firstPosition = (rowTile: Tile[], tileInsert: Tile): Tile[] => {
  const newTile = {id: tileInsert.id, form: tileInsert.form, color: tileInsert.color,
    x: rowTile[0].x - 1, y: tileInsert.y, disabled: true};
  return [newTile, ...rowTile];
};
export const lastPosition = (rowTile: Tile[], tileInsert: Tile): Tile[] => {
  const newTile = {id: tileInsert.id, form: tileInsert.form, color: tileInsert.color,
    x: rowTile[rowTile.length - 1].x + 1, y: tileInsert.y, disabled: true};
  return [...rowTile, newTile];

};


export const toPlate = (rowTile: Tile[]): Tile[][] => {
  const xmin: number = Math.min(...rowTile.map(tile => tile.x));
  const xmax = Math.max(...rowTile.map(tile => tile.x));
  const ymin = Math.min(...rowTile.map(tile => tile.y));
  const ymax = Math.max(...rowTile.map(tile => tile.y));
  let coordx = [];
  for (let k = xmin - 1; k <= xmax + 1; k++){
    coordx = [...coordx, k];
  }
  let coordy = [];
  for (let k = ymin - 1; k <= ymax + 1; k++){
    coordy = [...coordy, k];
  }
  const result: Tile[][]  = Array(coordy.length).fill(null).map((_, indexY) =>
    Array(coordx.length).fill(null).map((_, indexX) =>
      ({id: 0, form: 0, color: 0, x: coordx[indexX],
        y: coordy[indexY], disabled: false})));

  for (const tile of rowTile){
    let i = 0;
    for (const tileResult of result) {
      let j = 0;

      for (const tileCurrent of tileResult) {

        if (tile.x === tileCurrent.x && tile.y === tileCurrent.y) {
          result[i][j] = tile;
        }
        j++;
      }
      i++; }
  }
  return result;
};
