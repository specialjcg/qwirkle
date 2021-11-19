import { Color } from './Color';
import { Shape } from './Shape';
import { Player } from './player';

export interface Tiles {
    rackPosition: number;
    id: number;
    color: Color;
    shape: Shape;
}

export interface TileViewModel {
    playerId: number;
    TileId: number;
    X: number;
    Y: 0;
}
export const toTileviewModel = (player: Player): TileViewModel[] =>
    player.rack.tiles.map((tile) => ({
        playerId: player.id,
        TileId: tile.id,
        X: tile.rackPosition,
        Y: 0
    }));
