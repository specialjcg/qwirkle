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
