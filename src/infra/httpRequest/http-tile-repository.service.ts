import {Injectable} from '@angular/core';
import {PlayerTile, PlayerTileToSwap, Tile} from '../../domain/Tile';
import {
  ListGamedId,
  ListNamePlayer,
  Player,
  RestBag,
  RestBoard,
  RestSkipTurn,
  Result,
  toBoard,
  toPlayers,
  toWebPlayer,
  toWebTiles,
  toWebTotalPoint
} from './player';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const headers = new HttpHeaders()
  .set('Access-Control-Allow-Origin', '*')
  .set('Content-Type', 'application/json; charset=utf-8');


const toListGamedId = (response: number[]): ListGamedId => {
  return {listGameId: response};
};

const toListNamePlayer = (response: string[]): ListNamePlayer => ({listNamePlayer: response});

@Injectable({
  providedIn: 'root'
})

export default class HttpTileRepositoryService {

  constructor(private https: HttpClient) {
  }

  get(gameId: number): Promise<Tile[]> {
    return this.https.get<Player>('https://localhost:5001/Games/Players/' + gameId, {headers})
      .toPromise().then(response => toWebTiles(response));
  }

  getPlayerId(gameId: number): Promise<number> {
    return this.https.get<Player>('https://localhost:5001/Games/Players/' + gameId, {headers})
      .toPromise().then(response => toWebPlayer(response));
  }


  getPlayerTotalPoint(gameId: number): Promise<number> {
    return this.https.get<Player>('https://localhost:5001/Games/Players/' + gameId, {headers})
      .toPromise().then(response => toWebTotalPoint(response));
  }

  getGames(GameId: number): Promise<Tile[]> {
    return this.https.post<RestBoard>('https://localhost:5001/Games/get', [GameId], {headers})
      .toPromise().then(response => toBoard(response));
  }

  getPlayers(GameId: number): Promise<Player[]> {
    return this.https.post<RestBoard>('https://localhost:5001/Games/get', [GameId], {headers})
      .toPromise().then(response => toPlayers(response));
  }

  playTile(tiles: PlayerTile[]): Promise<Result> {
    return this.https.post<RestBoard>('https://localhost:5001/Games/PlayTiles/', tiles, {headers})
      .toPromise().then();
  }

  swapTile(tiles: PlayerTileToSwap[]): Promise<Result> {
    return this.https.post<RestBag>('https://localhost:5001/Games/SwapTiles/', tiles, {headers})
      .toPromise().then();
  }

  skipTurn(playerId: number): Promise<Result> {
    const player = {id: playerId};
    return this.https.post<RestSkipTurn>('https://localhost:5001/Games/SkipTurn/', player, {headers})
      .toPromise().then();
  }

  getListGames(): Promise<ListGamedId> {
    return this.https.get<number[]>('https://localhost:5001/Games/ListGameId/', {headers})
      .toPromise().then(response => toListGamedId(response));
  }

  getPlayerName(gameId: number): Promise<ListNamePlayer> {
    return this.https.post<string[]>('https://localhost:5001/Games/ListNamePlayer/' + gameId, {headers})
      .toPromise().then(response => toListNamePlayer(response));
  }

  newGame(players: number[]): Promise<number[]> {
    return this.https.post<Player>('https://localhost:5001/Games/', players).toPromise().then();
  }

  getPlayerNameToPlay(gameId: number): Observable<string> {
    return this.https.get<string>('https://localhost:5001/Games/GetPlayerNameTurn/' + gameId,
      {responseType: 'text' as 'json'});

  }

  // TODO
  getWinners(gameId: number): Promise<any> {
    return this.https.post<any>('https://localhost:5001/Games/Winners/' + gameId, {headers})
    .toPromise().then();
  }
}

