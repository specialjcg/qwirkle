import { TileFront } from './Tile';
import { positionIsFree } from './PositionIsFree';
import { Tiles } from './tiles';

export const setPositionTile = (tiles: TileFront[], tile: TileFront): TileFront[] => {
    const newTile = {
        shape: tile.shape,
        color: tile.color,
        x: tile.x,
        y: tile.y,
        disabled: tile.disabled
    };
    if (positionIsFree(tiles, newTile)) {
        return [...tiles, newTile].sort(
            (firstTile, secondTile) =>
                firstTile.y - secondTile.y || firstTile.x - secondTile.x
        );
    }

    return [...tiles];
};
export const toRarrange = (rack: Tiles[]): TileFront[] =>
    rack.map((tile, index) => {
        return {
            disabled: true,
            x: index,
            y: 0,
            color: tile.color,
            shape: tile.shape
        };
    });
export const toRarrangeRack = (rack: TileFront[]): TileFront[] =>
    rack.map((tile, index) => {
        return {
            disabled: true,
            x: index,
            y: 0,
            color: tile.color,
            shape: tile.shape,
        };
    });

export const toTiles = (rack: TileFront[]): Tiles[] =>
    rack.map((tile, index) => {
        return { color: tile.color, shape: tile.shape,  rackPosition: index };
    });
