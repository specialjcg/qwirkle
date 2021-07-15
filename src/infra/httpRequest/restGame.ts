import {Tiles} from './tiles';
import {Tile} from '../../domain/Tile';

export interface RestGame {
    id: number;
    pseudo: string;
    gameId: number;
    gamePosition: number;
    points: number;
    rack: { tiles: Tiles[] };
    isTurn: boolean;
}
export const toWebTiles = (result: RestGame[]): Tile[] => {
  return result[0].rack.tiles.map(tile => ({id: tile.id, color: tile.color, form: tile.form}));
};
