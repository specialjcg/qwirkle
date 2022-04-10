import { TileFront } from './Tile';
import { Shape } from './Shape';
import { Color } from './Color';
import { setPositionTile } from './SetPositionTile';
import { positionIsFree, positionIsNotFree } from './PositionIsFree';

describe('test position is free', () => {
    it('should test position is not free', () => {
        const tileOne: TileFront = {
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 1,
            y: 1,
            disabled: true
        };
        const rowTile: TileFront[] = [tileTwo, tileOne];
        expect(positionIsNotFree(rowTile, tileOne)).toBeTruthy();
    });
    it('should test position is free', () => {
        const tileOne: TileFront = {
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileThree: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 2,
            y: 0,
            disabled: true
        };
        const rowTile: TileFront[] = [tileTwo, tileOne];
        expect(positionIsNotFree(rowTile, tileThree)).toBeFalsy();
    });
    it('should test position is free and position y is not the same', () => {
        const tileOne: TileFront = {
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 1,
            disabled: true
        };
        const tileTwo: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 1,
            y: 0,
            disabled: true
        };
        const tileThree: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const rowTile: TileFront[] = [tileTwo, tileOne];
        expect(positionIsNotFree(rowTile, tileThree)).toBeFalsy();
    });
    it('should not set position is free', () => {
        const tileOne: TileFront = {
            shape: Shape.Circle,
            color: Color.Purple,
            x: 1,
            y: 0,
            disabled: true
        };
        const tileTwo: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 2,
            y: 0,
            disabled: true
        };
        const tileThree: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 2,
            y: 0,
            disabled: true
        };
        const rowTile: TileFront[] = [tileTwo, tileOne];
        expect(positionIsNotFree(rowTile, tileThree)).toBeTruthy();
    });
    it('should test position is not free for positionisfree', () => {
        const tileOne: TileFront = {
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const rowTile: TileFront[] = setPositionTile([tileTwo], tileOne);
        expect(positionIsFree(rowTile, tileOne)).toBeFalsy();
    });
    it('should test position is free for positionisfree', () => {
        const tileOne: TileFront = {
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileThree: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 2,
            y: 0,
            disabled: true
        };
        const rowTile: TileFront[] = setPositionTile([tileTwo], tileOne);
        expect(positionIsFree(rowTile, tileThree)).toBeTruthy();
    });
    it('should test position is free for positionisfree and id the same', () => {
        const tileOne: TileFront = {
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileThree: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 2,
            y: 1,
            disabled: true
        };
        const rowTile: TileFront[] = setPositionTile([tileTwo], tileOne);
        expect(positionIsFree(rowTile, tileThree)).toBeTruthy();
    });
    it('should test position is free for positionisfree and id the same but  y too', () => {
        const tileOne: TileFront = {
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileThree: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const rowTile: TileFront[] = setPositionTile([tileTwo], tileOne);
        expect(positionIsFree(rowTile, tileThree)).toBeFalsy();
    });
    it('should test position is free for positionisfree and id the same but  y too and x', () => {
        const tileOne: TileFront = {
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 1,
            y: 1,
            disabled: true
        };
        const tileThree: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 1,
            disabled: true
        };
        const rowTile: TileFront[] = [tileTwo, tileOne];
        expect(positionIsFree(rowTile, tileThree)).toBeTruthy();
    });
    it('should not set position is free for positionfree', () => {
        const tileOne: TileFront = {
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileThree: TileFront = {
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const rowTile: TileFront[] = [tileTwo, tileOne];
        expect(positionIsNotFree(rowTile, tileThree)).toBeTruthy();
    });
});
