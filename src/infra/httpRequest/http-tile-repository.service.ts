import {Injectable} from '@angular/core';
import {PlayerTile, Tile} from '../../domain/Tile';
import {
  ListGamedId,
  ListNamePlayer,
  Player,
  RestBoard,
  Result,
  toBoard,
  toPlayers,
  toWebPlayer,
  toWebTiles,
  toWebTotalPoint
} from './player';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';

const headers = new HttpHeaders()
  .set('Access-Control-Allow-Origin', '*')
  .set('Content-Type', 'application/json; charset=utf-8');


const toListGamedId = (response: number[]): ListGamedId => {
  return {listGameId: response};
};

function toListNamePlayer(response: string[]): ListNamePlayer {
  return {listNamePlayer: response};
}

// tslint:disable-next-line:ban-types
export const toPlayerId = (result: Object): string => {

  return result as string;
};

@Injectable({
  providedIn: 'root'
})

export default class HttpTileRepositoryService {

  constructor(private http: HttpClient) {
  }

  get(gameId: number): Promise<Tile[]> {
    return this.http.get<Player>('http://localhost:5000/Games/Players/' + gameId, {headers})
      .toPromise().then(response => toWebTiles(response));
  }

  getPlayerId(gameId: number): Promise<number> {
    return this.http.get<Player>('http://localhost:5000/Games/Players/' + gameId, {headers})
      .toPromise().then(response => toWebPlayer(response));
  }


  getPlayerTotalPoint(gameId: number): Promise<number> {
    return this.http.get<Player>('http://localhost:5000/Games/Players/' + gameId, {headers})
      .toPromise().then(response => toWebTotalPoint(response));
  }

  getGames(GameId: number): Promise<Tile[]> {
    return this.http.post<RestBoard>('http://localhost:5000/Games/get', [GameId], {headers})
      .toPromise().then(response => toBoard(response));
  }
  getPlayers(GameId: number): Promise<Player[]> {
    return this.http.post<RestBoard>('http://localhost:5000/Games/get', [GameId], {headers})
      .toPromise().then(response => toPlayers(response));
  }
  playTile(playtile: PlayerTile[]): Promise<Result> {
    return this.http.post<RestBoard>('http://localhost:5000/Games/PlayTiles/', playtile)
      .toPromise().then();
  }

  getListGames(): Promise<ListGamedId> {
    return this.http.get<number[]>('http://localhost:5000/Games/ListGameId/', {headers})
      .toPromise().then(response => toListGamedId(response));
  }
  getPlayerName(GameId: number): Promise<ListNamePlayer> {
    return this.http.post<string[]>('http://localhost:5000/Games/ListNamePlayer/' + GameId, {headers})
      .toPromise().then(response => toListNamePlayer(response));
  }
  newGame(players: number[]): Promise<number[]> {
    return this.http.post<Player>('http://localhost:5000/Games/', players).toPromise().then();
  }
   getPlayerNameToPlay(gameId: number): Observable<string>{
     return this.http.get<string>('http://localhost:5000/Games/GetPlayerNameTurn/' + gameId,
       {responseType: 'text' as 'json'});

   }
}

