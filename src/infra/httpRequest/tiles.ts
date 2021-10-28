import {Color} from '../../domain/Color';
import {Form} from '../../domain/Form';
import {Player} from './player';

export interface Tiles {
  rackPosition: number;
  id: number;
  color: Color;
  form: Form;
}

export interface TileViewModel {
  playerId: number;
  TileId: number;
  X: number;
  Y: 0;
}
export const toTileviewModel = (player: Player): TileViewModel[] =>  player.rack.tiles
  .map(tile => ({playerId: player.id, TileId: tile.id, X: tile.rackPosition, Y: 0}));
