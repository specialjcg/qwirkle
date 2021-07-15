import {Color} from './Color';
import {Form} from './Form';
import {Tile, toImageName} from './Tile';

describe('create tiles list', () => {
  it('should create a tile id', () => {
    const tile: Tile = {id: 1, form: Form.Circle, color: Color.Purple};
    expect(tile.id).toEqual(1);
  });
  it('should create a tile form', () => {
    const tile: Tile = {id: 1, form: Form.Circle, color: Color.Purple};
    expect(tile.form).toEqual(Form.Circle);
  });
  it('should create a tile color', () => {
    const tile: Tile = {id: 1, form: Form.Circle, color: Color.Purple};
    expect(tile.color).toEqual(Color.Purple);
  });
  it('should get image name from Tile', () => {
    const tile: Tile = {id: 1, form: Form.Circle, color: Color.Purple};
    expect(toImageName(tile)).toEqual('PurpleCircle.svg');
  });
});
