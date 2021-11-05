import {Tile} from './Tile';
import {Color} from './Color';
import {Shape} from './Shape';
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
    shape: tile.shape,
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
  shape: Shape;
}
export interface TilesOnBag {
  id: number;
  color: Color;
  shape: Shape;
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
export interface BoardGame {
  boards: Tile[];
  players: Player[];
}
export interface RestTilesSwap {
  playerId: number;
  tileId: number;
}

export const toBoard = (result: RestBoard): BoardGame => {
  return {boards: result.board.tiles.map(tile1 => ({
    x: tile1.coordinates.x, y: tile1.coordinates.y,
    id: tile1.id, shape: tile1.shape, color: tile1.color, disabled: false
  })), players: result.players};
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
export interface ListUsersId {

  listUsersId: number[];
}
export interface ListNamePlayer {

  listNamePlayer: string[];
}
