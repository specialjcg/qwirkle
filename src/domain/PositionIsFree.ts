import { Shape } from './Shape';
import { Color } from './Color';
import { TileFront } from './Tile';

export const positionIsNotFree = (
    tiles: TileFront[],
    newTile: {
        shape: Shape;
        color: Color;
        x: number;
        y: number;
        disabled: boolean;
    }
): boolean => tiles.some((tile) => tile.x === newTile.x && tile.y === newTile.y);
export const positionIsFree = (
    tiles: TileFront[],
    newTile: {
        shape: Shape;
        color: Color;
        x: number;
        y: number;
        disabled: boolean;
    }
): boolean =>
    tiles.filter((tile) => tile.x === newTile.x && tile.y === newTile.y).length === 0;
