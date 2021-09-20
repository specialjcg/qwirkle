import {Tile} from './Tile';
import {positionIsFree} from './PositionIsFree';

export const setPositionTile = (tiles: Tile[], tile: Tile): Tile[] => {
    const newTile = {id: tile.id, form: tile.form, color: tile.color, x: tile.x, y: tile.y, disabled: tile.disabled};
    if (positionIsFree(tiles, newTile)) {
        return [...tiles, newTile].sort((firstTile, secondTile) =>
            (firstTile.y - secondTile.y) || (firstTile.x - secondTile.x));

    }

    return [...tiles];
};
