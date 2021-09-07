import {Tile} from '../../domain/Tile';
import {Color} from '../../domain/Color';
import {Form} from '../../domain/Form';

export interface RestGame {
  id: number;
  pseudo: string;
  gameId: number;
  gamePosition: number;
  points: number;
  rack: { tiles: Tile[] };
  isTurn: boolean;
}

export const toWebTiles = (result: RestGame): Tile[] => {
  return result.rack.tiles.map(tile => ({
    id: tile.id,
    color: tile.color,
    form: tile.form,
    x: tile.x,
    y: tile.y,
    disabled: false
  }));
};

interface Coord {
  x: number;
  y: number;
}

export interface TilesOnBoard {
  coordinates: Coord;
  id: number;
  color: Color;
  form: Form;
}

export interface RestBoard {

  board: { tiles: TilesOnBoard[] };

}

export interface RestTilesPlay {
  playerId: number;
  tileId: number;
  x: number;
  y: number;
}

export const toBoard = (result: RestBoard): Tile[] => {
  return result.board.tiles.map(tile1 => ({
    x: tile1.coordinates.x, y: tile1.coordinates.y,
    id: tile1.id, form: tile1.form, color: tile1.color, disabled: false
  }));
};
export const fromBoard = (result: Tile[]): RestTilesPlay[] => {
  return result.map<RestTilesPlay>(tile1 => ({playerId: 10, tileId: tile1.id, x: tile1.x, y: tile1.y}));
};

export interface Result {
  code: number;
  tilesPlayed: [];
  newRack: [];
  points: number;
}
