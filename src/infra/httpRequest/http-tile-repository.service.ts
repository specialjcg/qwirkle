import {Injectable} from '@angular/core';
import {TileRepository} from './tileRepository';
import {Tile} from '../../domain/Tile';
import {RestGame, toWebTiles} from './restGame';
import {HttpClient, HttpHeaders} from '@angular/common/http';
const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');
@Injectable({
  providedIn: 'root'
})

export default class HttpTileRepositoryService  implements TileRepository{
  constructor(private http: HttpClient) {
}

  get(): Promise<Tile[]> {
    return this.http.post<RestGame[]>('http://localhost:5000/Games/', [10], { headers })
      .toPromise().then(response => toWebTiles(response));
  }


}
