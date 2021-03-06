import { TileFront } from './Tile';
import { Color } from './Color';
import { Shape } from './Shape';
import { Tiles, TileViewModel } from './tiles';

export interface Player {
    id: number;
    pseudo: string;
    userId: number;
    gameId: number;
    gamePosition: number;
    points: number;
    lastTurnPoints: number;
    rack: {
      tiles: Tiles[];
      tilesNumber:number;
    };
    isTurn: boolean;
}
export const toWebPlayer = (result: Player): number => {
    return result.id;
};

export const toWebTiles = (result: Player): TileFront[] => {
    return result.rack.tiles.map((tile) => ({
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
    coordinate: Coord;
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
    bag: { tiles: TilesOnBag[] };
}
export interface RestRack {
    code: number;
    gameId: number;
    move: {
        tilesPlayed: [];

        points: number;
    };
    newRack: [];
}
export interface RestBag {
    bag: { tiles: TilesOnBag[] };
    players: Player[];
}

export interface SkipTurnViewModel {
    gameId: number;
}

export interface RestSkipTurn {
    playerId: number;
}

export interface RestTilesPlay {
    playerId: number;
    x: number;
    y: number;
}
export interface BoardGame {
    boards: TileFront[];
    players: Player[];
    bag: { tiles: TilesOnBag[] };
}
export interface RestTilesSwap {
    playerId: number;
}

export const toBoard = (result: RestBoard): BoardGame => {
    return {
        boards: result.board.tiles.map((tile1) => ({
            x: tile1.coordinate.x,
            y: tile1.coordinate.y,
            shape: tile1.shape,
            color: tile1.color,
            disabled: false
        })),
        players: result.players,
        bag: result.bag
    };
};
export const toPlayers = (result: RestBoard): Player[] => {
    return result.players;
};
export const toChangeRack = (rack: RestRack): Rack => {
    return {
        code: rack.code,
        tilesPlayed: rack.move.tilesPlayed,
        newRack: rack.newRack,
        points: rack.move.points
    };
};
export const fromBoard = (result: TileFront[], gameId: number): TileViewModel[] => {
    return result.map((tile) => ({
        gameId: gameId,
        shape: tile.shape,
        color: tile.color,
        X: tile.x,
        Y: tile.y
    }));
};
export const fromSwap = (result: TileFront[], GameId: number): TileViewModel[] => {
    return result.map<TileViewModel>((tile) => ({
        gameId: GameId,
        color: tile.color,
        shape: tile.shape,
        X: tile.x,
        Y: tile.y
    }));
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
