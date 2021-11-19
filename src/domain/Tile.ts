import { Shape } from './Shape';
import { Color } from './Color';
import { setPositionTile } from './SetPositionTile';
import { positionIsNotFree } from './PositionIsFree';
import { Tiles } from './tiles';

export type Tile = {
    disabled: boolean;
    readonly id: number;
    readonly shape: Shape;
    readonly color: Color;
    readonly y: number;
    readonly x: number;
};

export const toNameImage = (tile: Tile) =>
    tile.shape === 0
        ? ''
        : Object.keys(Color)[Object.values(Color).indexOf(tile.color)] +
          Object.keys(Shape)[Object.values(Shape).indexOf(tile.shape)] +
          '.svg';

export type Login = {
    pseudo: string;
    password: string;
    isRemember: boolean;
};

export type PlayerTile = {
    playerId: number;
    tileId: number;
    x: number;
    y: number;
};

export type PlayerTileToSwap = {
    playerId: number;
    tileId: number;
};

const shiftToRight = (tile: Tile): Tile => ({
    id: tile.id,
    shape: tile.shape,
    color: tile.color,
    x: tile.x - 1,
    y: tile.y,
    disabled: true
});

export const onRight = (tile: Tile, xposition: number, newTile: Tile): boolean =>
    tile.x >= xposition && tile.y === newTile.y;

const shiftToLeft = (tile: Tile): Tile => ({
    id: tile.id,
    shape: tile.shape,
    color: tile.color,
    x: tile.x + 1,
    y: tile.y,
    disabled: true
});

export const otherTileInRow = (tileInsert: Tile) => (tile: Tile) =>
    tile.id !== tileInsert.id && tileInsert.y === tile.y;

const tileNotInRow = (tileInsert: Tile) => (tile: Tile) => tileInsert.y !== tile.y;
export const onLeft = (xposition: number) => (tile: Tile) => tile.x < xposition;

function placeTileToLeft(
    rowTile: Tile[],
    xposition: number,
    newTile: {
        shape: Shape;
        color: Color;
        x: number;
        y: number;
        disabled: boolean;
        id: number;
    }
) {
    return rowTile.map((tile) => {
        if (onRight(tile, xposition, newTile)) {
            return shiftToLeft(tile);
        }
        return tile;
    });
}

function placeTileToRigth(rowTile: Tile[], xposition: number) {
    return rowTile.map((tile) => {
        if (onLeft(xposition) && tile.disabled) {
            return shiftToRight(tile);
        }
        return tile;
    });
}

export const insertPosition = (
    nexTiles: Tile[],
    tileInsert: Tile,
    xposition: number
): Tile[] => {
    if (tileInsert.disabled) {
        let rowTile = nexTiles.filter(otherTileInRow(tileInsert));

        const rowTilenotInsert = nexTiles.filter(tileNotInRow(tileInsert));
        let newTile: Tile = {
            id: tileInsert.id,
            shape: tileInsert.shape,
            color: tileInsert.color,
            x: xposition,
            y: tileInsert.y,
            disabled: true
        };
        if (positionIsNotFree(rowTile, newTile)) {
            const before = rowTile.filter(onLeft(xposition));
            const after = rowTile.filter((tile) => onRight(tile, xposition, newTile));

            if (before.length > 0 && after[0].disabled) {
                rowTile = placeTileToLeft(rowTile, xposition, newTile);
            } else if (before[0] !== undefined && before[before.length - 1].disabled) {
                rowTile = placeTileToRigth(rowTile, xposition);
                newTile = shiftToRight(newTile);
            } else {
                if (before.length >= after.length) {
                    const xmax = Math.max(...rowTile.map((max) => max.x));
                    newTile = {
                        id: tileInsert.id,
                        shape: tileInsert.shape,
                        color: tileInsert.color,
                        x: xmax + 1,
                        y: tileInsert.y,
                        disabled: true
                    };
                } else {
                    const xmin = Math.min(...rowTile.map((min) => min.x));

                    newTile = {
                        id: tileInsert.id,
                        shape: tileInsert.shape,
                        color: tileInsert.color,
                        x: xmin - 1,
                        y: tileInsert.y,
                        disabled: true
                    };
                }
            }
        }

        return setPositionTile(
            [...rowTilenotInsert, ...rowTile].filter((tile) => tile.id !== newTile.id),
            newTile
        );
    }
    return nexTiles;
};

export const getInsertTile = (
    tileInsert: Tiles,
    xposition: number,
    yposition: number
) => ({
    id: tileInsert.id,
    shape: tileInsert.shape,
    color: tileInsert.color,
    x: xposition,
    y: yposition,
    disabled: true
});

export const toPlate = (rowTile: Tile[]): Tile[][] => {
    const xmin: number = Math.min(...rowTile.map((tile) => tile.x));
    const xmax = Math.max(...rowTile.map((tile) => tile.x));
    const ymin = Math.min(...rowTile.map((tile) => tile.y));
    const ymax = Math.max(...rowTile.map((tile) => tile.y));
    let coordx: number[] = [];
    for (let k = xmin - 1; k <= xmax + 1; k++) {
        coordx = [...coordx, k];
    }
    let coordy: number[] = [];
    for (let k = ymin - 1; k <= ymax + 1; k++) {
        coordy = [...coordy, k];
    }
    const result: Tile[][] = new Array(coordy.length).fill(null).map((_, indexY) =>
        new Array(coordx.length).fill(null).map((_, indexX) => ({
            id: 0,
            shape: 0,
            color: 0,
            x: coordx[indexX],
            y: coordy[indexY],
            disabled: false
        }))
    );

    for (const tile of rowTile) {
        let index = 0;
        for (const tileResult of result) {
            let index_ = 0;

            for (const tileCurrent of tileResult) {
                if (tile.x === tileCurrent.x && tile.y === tileCurrent.y) {
                    result[index][index_] = tile;
                }
                index_++;
            }
            index++;
        }
    }
    return result;
};
