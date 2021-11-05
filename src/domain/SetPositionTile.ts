import {Tile} from './Tile';
import {positionIsFree} from './PositionIsFree';
import {Tiles} from './tiles';
import {Shape} from './Shape';
import {Color} from './Color';

export const setPositionTile = (tiles: Tile[], tile: Tile): Tile[] => {
    const newTile = {id: tile.id, shape: tile.shape, color: tile.color, x: tile.x, y: tile.y, disabled: tile.disabled};
    if (positionIsFree(tiles, newTile)) {
        return [...tiles, newTile].sort((firstTile, secondTile) =>
            (firstTile.y - secondTile.y) || (firstTile.x - secondTile.x));

    }

    return [...tiles];
};
export const toRarrange = (rack: Tiles[]): Tile[] =>  rack.map((tile, index) => {
  return {disabled: true, x: index, y: 0, color: tile.color, shape : tile.shape, id : tile.id}; });


export const toTiles = (rack: Tile[]): Tiles[] => rack.map((tile, index) => {
  return {color: tile.color, shape : tile.shape, id : tile.id, rackPosition: index}; });
