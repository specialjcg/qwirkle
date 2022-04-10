import { Shape } from './Shape';
import { Color } from './Color';
import { setPositionTile } from './SetPositionTile';
import { positionIsNotFree } from './PositionIsFree';
import { Tiles } from './tiles';

export type TileFront = {
    disabled: boolean;

    readonly shape: Shape;
    readonly color: Color;
    readonly y: number;
    readonly x: number;
};

export const toNameImage = (tile: TileFront) =>
    tile.shape === 0
        ? ''
        : Object.keys(Color)[Object.values(Color).indexOf(tile.color)] +
          Object.keys(Shape)[Object.values(Shape).indexOf(tile.shape)] +
          '.svg';

export type Login = {
    userName: string;
    password: string;
  RememberMe: boolean;
};

export type PlayerTile = {
    readonly shape: Shape;
    readonly color: Color;

    playerId: number;
    x: number;
    y: number;
};

export type PlayerTileToSwap = {
    playerId: number;
};

const shiftToRight = (tile: TileFront): TileFront => ({
    shape: tile.shape,
    color: tile.color,
    x: tile.x - 1,
    y: tile.y,
    disabled: true
});

export const onRight = (tile: TileFront, xposition: number, newTile: TileFront): boolean =>
    tile.x >= xposition && tile.y === newTile.y;

const shiftToLeft = (tile: TileFront): TileFront => ({
    shape: tile.shape,
    color: tile.color,
    x: tile.x + 1,
    y: tile.y,
    disabled: true
});

export const otherTileInRow = (tileInsert: TileFront) => (tile: TileFront) =>
    tileInsert.y === tile.y &&
    !(
        tile.shape === tileInsert.shape &&
        tile.color === tileInsert.color &&
        tile.disabled === tileInsert.disabled
    );

const tileNotInRow = (tileInsert: TileFront) => (tile: TileFront) => tileInsert.y !== tile.y;
export const onLeft = (xposition: number) => (tile: TileFront) => tile.x < xposition;

function placeTileToLeft(
    rowTile: TileFront[],
    xposition: number,
    newTile: {
        shape: Shape;
        color: Color;
        x: number;
        y: number;
        disabled: boolean;
    }
) {
    return rowTile.map((tile) => {
        if (onRight(tile, xposition, newTile)) {
            return shiftToLeft(tile);
        }
        return tile;
    });
}

function placeTileToRigth(rowTile: TileFront[], xposition: number) {
    return rowTile.map((tile) => {
        if (onLeft(xposition) && tile.disabled) {
            return shiftToRight(tile);
        }
        return tile;
    });
}

export const insertPosition = (
    nexTiles: TileFront[],
    tileInsert: TileFront,
    xposition: number
): TileFront[] => {
    if (tileInsert.disabled) {
        let rowTile = nexTiles.filter(otherTileInRow(tileInsert));

        const rowTilenotInsert = nexTiles.filter(tileNotInRow(tileInsert));
        let newTile: TileFront = {
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
                        shape: tileInsert.shape,
                        color: tileInsert.color,
                        x: xmax + 1,
                        y: tileInsert.y,
                        disabled: true
                    };
                } else {
                    const xmin = Math.min(...rowTile.map((min) => min.x));

                    newTile = {
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
            [...rowTilenotInsert, ...rowTile].filter(
                (tile) =>
                    !(
                        tile.shape === tileInsert.shape &&
                        tile.color === tileInsert.color &&
                        tile.disabled === tileInsert.disabled
                    )
            ),
            newTile
        );
    }
    return nexTiles;
};

export const getInsertTile = (
    tileInsert: Tiles,
    xposition: number,
    yposition: number
): TileFront => ({
    shape: tileInsert.shape,
    color: tileInsert.color,
    x: xposition,
    y: yposition,
    disabled: true
});

export const toPlate = (rowTile: TileFront[]): TileFront[][] => {
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
    const result: TileFront[][] = new Array(coordy.length).fill(null).map((_, indexY) =>
        new Array(coordx.length).fill(null).map((_, indexX) => ({
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
