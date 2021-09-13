import {Injectable} from '@angular/core';
import {PlayerTile, Tile} from '../../domain/Tile';
import {RestBoard, RestGame, Result, TilesOnBoard, toBoard, toWebPlayer, toWebTiles, toWebTotalPoint} from './restGame';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const headers = new HttpHeaders()
  .set('Access-Control-Allow-Origin', '*');


@Injectable({
  providedIn: 'root'
})

export default class HttpTileRepositoryService {
  constructor(private http: HttpClient) {
  }

  get(gameId: number): Promise<Tile[]> {
    return this.http.get<RestGame>('http://localhost:5000/Games/Players/' + gameId, {headers})
      .toPromise().then(response => toWebTiles(response));
  }
  getPlayerId(gameId: number): Promise<number> {
    return this.http.get<RestGame>('http://localhost:5000/Games/Players/' + gameId, {headers})
  .toPromise().then(response => toWebPlayer(response));
  }
  getPlayerTotalPoint(gameId: number): Promise<number> {
    return this.http.get<RestGame>('http://localhost:5000/Games/Players/' + gameId, {headers})
      .toPromise().then(response => toWebTotalPoint(response));
  }
  getGames(GameId: number): Promise<Tile[]> {
    return this.http.post<RestBoard>('http://localhost:5000/Games/get', [GameId], {headers})
      .toPromise().then(response => toBoard(response));
  }
  playTile(playtile: PlayerTile[]): Promise<Result> {
    return this.http.post<RestBoard>('http://localhost:5000/Games/PlayTiles/', playtile)
      .toPromise().then();
  }


}
