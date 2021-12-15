import { Color } from './Color';
import { Shape } from './Shape';
import { Player } from './player';

export interface Tiles {
    rackPosition: number;

    color: Color;
    shape: Shape;
}

export interface TileViewModel {
    gameId: number;
    shape: Shape;
    color: Color;
    X: number;
    Y: number;
}
export const toTileviewModel = (player: Player): TileViewModel[] =>
    player.rack.tiles.map((tile) => ({
        gameId: player.gameId,
        shape: tile.shape,
        color: tile.color,
        X: tile.rackPosition,
        Y: 0
    }));
