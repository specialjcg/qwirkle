import {Injectable} from '@angular/core';
import {PlayerTile, Tile} from '../../domain/Tile';
import {
  ListGamedId,
  RestBoard,
  Player,
  Result,
  toBoard,
  toWebPlayer,
  toWebTiles,
  toWebTotalPoint,
  toPlayers, ListNamePlayer
} from './player';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { PlayerTurnComponent } from 'src/app/player-turn/player-turn.component';

const headers = new HttpHeaders()
  .set('Access-Control-Allow-Origin', '*');


const toListGamedId = (response: number[]): ListGamedId => {
  return {listGameId: response};
};

function toListNamePlayer(response: string[]): ListNamePlayer {
  return {listNamePlayer: response};
}

export const toPlayerId = (result: number): number => {
  console.log(result);
  return result;
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
   getPlayerIdToPlay(gameId: number) : Promise<number>{
     return this.http.get<Player>('http://localhost:5000/Games/PlayerIdToPlay/' + gameId, {headers})
       .toPromise().then(response => toPlayerId(response));
   }
}

