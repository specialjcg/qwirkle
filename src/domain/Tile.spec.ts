import {Tile, toNameImage} from "./Tile";
import {Form} from "./Form";
import {Color} from "./Color";


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
    expect(toNameImage(tile)).toEqual('PurpleCircle.png');
  });

});
