import {Form} from './Form';
import {Color} from './Color';
import {Tile} from './Tile';

export const positionIsNotFree =
  (tiles: Tile[], newTile: { form: Form; color: Color; x: number; y: number; disabled: boolean; id: number }): boolean =>
    tiles.filter(tile => tile.x === newTile.x && tile.y === newTile.y || tile.id === newTile.id).length !== 0;
export const positionIsFree =
  (tiles: Tile[], newTile: { form: Form; color: Color; x: number; y: number; disabled: boolean; id: number }): boolean =>
    tiles.filter(tile => tile.x === newTile.x && tile.y === newTile.y || tile.id === newTile.id).length === 0;
