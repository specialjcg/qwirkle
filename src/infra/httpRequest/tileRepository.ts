import {Tile} from '../../domain/Tile';

export interface TileRepository {
  get(): Promise<Tile[]>;
}
