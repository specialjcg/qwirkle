import {Tile} from '../../domain/Tile';
import {Color} from '../../domain/Color';
import {Form} from '../../domain/Form';
import {Tiles} from './tiles';

export interface Player {
  id: number;
  pseudo: string;
  gameId: number;
  gamePosition: number;
  points: number;
  lastTurnPoints: number;
  rack: { tiles: Tiles[] };
  isTurn: boolean;
}
export const toWebPlayer = (result: Player): number => {
  return result.id;
};

export const toWebTiles = (result: Player): Tile[] => {
  return result.rack.tiles.map(tile => ({
    id: tile.id,
    color: tile.color,
    form: tile.form,
    x: 0,
    y: 0,
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
export interface TilesOnBag {
  id: number;
  color: Color;
  form: Form;
}

export interface RestBoard {

  board: { tiles: TilesOnBoard[] };
  players: Player[];
}
export interface RestRack {

  code: number;
  tilesPlayed: [];
  newRack: [];
  points: number;

}
export interface RestBag {

  bag: { tiles: TilesOnBag[] };
  players: Player[];
}

export interface RestSkipTurn {
  playerId: number;
}

export interface RestTilesPlay {
  playerId: number;
  tileId: number;
  x: number;
  y: number;
}

export interface RestTilesSwap {
  playerId: number;
  tileId: number;
}

export const toBoard = (result: RestBoard): Tile[] => {
  return result.board.tiles.map(tile1 => ({
    x: tile1.coordinates.x, y: tile1.coordinates.y,
    id: tile1.id, form: tile1.form, color: tile1.color, disabled: false
  }));
};
export const toPlayers = (result: RestBoard): Player[] => {
  return result.players;
};
export const toChangeRack = (rack: RestRack): Rack => {
  return {code: rack.code, tilesPlayed: rack.tilesPlayed, newRack: rack.newRack, points: rack.points};
};
export const fromBoard = (result: Tile[], playerId: number): RestTilesPlay[] => {
  return result.map<RestTilesPlay>(tile => ({playerId, tileId: tile.id, x: tile.x, y: tile.y}));
};
export const fromBag = (result: Tile[], playerId: number): RestTilesSwap[] => {
  return result.map<RestTilesSwap>(tile => ({playerId, tileId: tile.id}));
};

export interface Rack {
  code: number;
  tilesPlayed: [];
  newRack: [];
  points: number;
}
export interface ListGamedId {

  listGameId: number[];
}
export interface ListNamePlayer {

  listNamePlayer: string[];
}
