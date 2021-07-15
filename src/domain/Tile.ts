import {Form} from './Form';
import {Color} from './Color';

export type Tile = {
  readonly id: number,
  readonly form: Form,
  readonly color: Color
};


export const toNameImage = (tile: Tile) => Object.keys(Color)[Object.values(Color).indexOf(tile.color)] +
  Object.keys(Form)[Object.values(Form).indexOf(tile.form)] + '.png';
