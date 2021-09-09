import {Injectable} from '@angular/core';
import {PlayerTile, Tile} from '../../domain/Tile';
import {RestBoard, RestGame, Result, TilesOnBoard, toBoard, toWebTiles} from './restGame';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');


@Injectable({
  providedIn: 'root'
})

export default class HttpTileRepositoryService {
  constructor(private http: HttpClient) {
  }

  get(): Promise<Tile[]> {
    return this.http.get<RestGame>('http://localhost:5000/Games/Players/10')
      .toPromise().then(response => toWebTiles(response));
  }

  getGames(): Promise<Tile[]> {
    return this.http.post<RestBoard>('http://localhost:5000/Games/get', [10])
      .toPromise().then(response => toBoard(response));
  }
  playTile(playtile: PlayerTile[]): Promise<Result> {
    return this.http.post<RestBoard>('http://localhost:5000/Games/PlayTiles/', playtile)
      .toPromise().then();
  }

}
