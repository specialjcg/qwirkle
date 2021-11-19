import { Tile } from './Tile';
import { Shape } from './Shape';
import { Color } from './Color';
import { setPositionTile } from './SetPositionTile';
import { positionIsFree, positionIsNotFree } from './PositionIsFree';

describe('test position is free', () => {
    it('should test position is not free', () => {
        const tileOne: Tile = {
            id: 1,
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: Tile = {
            id: 1,
            shape: Shape.Square,
            color: Color.Purple,
            x: 1,
            y: 1,
            disabled: true
        };
        const rowTile: Tile[] = [tileTwo, tileOne];
        expect(positionIsNotFree(rowTile, tileOne)).toBeTruthy();
    });
    it('should test position is free', () => {
        const tileOne: Tile = {
            id: 1,
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: Tile = {
            id: 2,
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileThree: Tile = {
            id: 3,
            shape: Shape.Square,
            color: Color.Purple,
            x: 2,
            y: 0,
            disabled: true
        };
        const rowTile: Tile[] = [tileTwo, tileOne];
        expect(positionIsNotFree(rowTile, tileThree)).toBeFalsy();
    });
    it('should test position is free and position y is not the same', () => {
        const tileOne: Tile = {
            id: 1,
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 1,
            disabled: true
        };
        const tileTwo: Tile = {
            id: 2,
            shape: Shape.Square,
            color: Color.Purple,
            x: 1,
            y: 0,
            disabled: true
        };
        const tileThree: Tile = {
            id: 3,
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const rowTile: Tile[] = [tileTwo, tileOne];
        expect(positionIsNotFree(rowTile, tileThree)).toBeFalsy();
    });
    it('should not set position is free', () => {
        const tileOne: Tile = {
            id: 1,
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: Tile = {
            id: 2,
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileThree: Tile = {
            id: 1,
            shape: Shape.Square,
            color: Color.Purple,
            x: 2,
            y: 0,
            disabled: true
        };
        const rowTile: Tile[] = [tileTwo, tileOne];
        expect(positionIsNotFree(rowTile, tileThree)).toBeTruthy();
    });
    it('should test position is not free for positionisfree', () => {
        const tileOne: Tile = {
            id: 1,
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: Tile = {
            id: 2,
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const rowTile: Tile[] = setPositionTile([tileTwo], tileOne);
        expect(positionIsFree(rowTile, tileOne)).toBeFalsy();
    });
    it('should test position is free for positionisfree', () => {
        const tileOne: Tile = {
            id: 1,
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: Tile = {
            id: 2,
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileThree: Tile = {
            id: 3,
            shape: Shape.Square,
            color: Color.Purple,
            x: 2,
            y: 0,
            disabled: true
        };
        const rowTile: Tile[] = setPositionTile([tileTwo], tileOne);
        expect(positionIsFree(rowTile, tileThree)).toBeTruthy();
    });
    it('should test position is free for positionisfree and id the same', () => {
        const tileOne: Tile = {
            id: 1,
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: Tile = {
            id: 2,
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileThree: Tile = {
            id: 1,
            shape: Shape.Square,
            color: Color.Purple,
            x: 2,
            y: 1,
            disabled: true
        };
        const rowTile: Tile[] = setPositionTile([tileTwo], tileOne);
        expect(positionIsFree(rowTile, tileThree)).toBeTruthy();
    });
    it('should test position is free for positionisfree and id the same but  y too', () => {
        const tileOne: Tile = {
            id: 1,
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: Tile = {
            id: 2,
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileThree: Tile = {
            id: 1,
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const rowTile: Tile[] = setPositionTile([tileTwo], tileOne);
        expect(positionIsFree(rowTile, tileThree)).toBeFalsy();
    });
    it('should test position is free for positionisfree and id the same but  y too and x', () => {
        const tileOne: Tile = {
            id: 1,
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: Tile = {
            id: 2,
            shape: Shape.Square,
            color: Color.Purple,
            x: 1,
            y: 1,
            disabled: true
        };
        const tileThree: Tile = {
            id: 1,
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 1,
            disabled: true
        };
        const rowTile: Tile[] = [tileTwo, tileOne];
        expect(positionIsFree(rowTile, tileThree)).toBeFalsy();
    });
    it('should not set position is free for positionfree', () => {
        const tileOne: Tile = {
            id: 1,
            shape: Shape.Circle,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileTwo: Tile = {
            id: 2,
            shape: Shape.Square,
            color: Color.Purple,
            x: 0,
            y: 0,
            disabled: true
        };
        const tileThree: Tile = {
            id: 1,
            shape: Shape.Square,
            color: Color.Purple,
            x: 2,
            y: 0,
            disabled: true
        };
        const rowTile: Tile[] = [tileTwo, tileOne];
        expect(positionIsNotFree(rowTile, tileThree)).toBeTruthy();
    });
});
