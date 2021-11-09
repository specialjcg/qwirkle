import {Injectable} from '@angular/core';
import {PlayerTile, PlayerTileToSwap} from '../../domain/Tile';
import {
  BoardGame,
  ListGamedId,
  ListUsersId,
  Player,
  Rack,
  RestBag,
  RestBoard,
  RestRack,
  RestSkipTurn,
  toBoard,
  toChangeRack,
} from '../../domain/player';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TileViewModel} from '../../domain/tiles';
import {environment} from "../../environments/environment.prod";
export const backurl=environment.backend.baseURL
const headers = new HttpHeaders()
  .set('Access-Control-Allow-Origin', '*')
  .set('Content-Type', 'application/json; charset=utf-8');


const toListGamedId = (response: number[]): ListGamedId => {
  return {listGameId: response};
};

const toListUsersId = (response: number[]): ListUsersId => {
  return {listUsersId: response};
};


@Injectable({
  providedIn: 'root'
})

export default class HttpTileRepositoryService {

  constructor(private https: HttpClient) {
  }


  getGames(GameId: number): Promise<BoardGame> {
    return this.https.post<RestBoard>(backurl+'/Games/get', [GameId], {headers})
      .toPromise().then(response => {
        console.log(response);
        return toBoard(response)
      });
  }

  getPlayer(gameId: number, userId: number): Promise<Player> {
    return this.https.get<string>(backurl+'/Games/Players/' + gameId + '/' + userId, {headers})
      .toPromise().then();

  }

  playTile(tiles: PlayerTile[]): Promise<Rack> {
    return this.https.post<RestBoard>(backurl+'/Games/PlayTiles/', tiles, {headers})
      .toPromise().then();
  }

  rackChangeOrder(rack: TileViewModel[]): Promise<Rack> {
    return this.https.post<RestRack>(backurl+'/Games/ArrangeRack/', rack, {headers})
      .toPromise().then(response => toChangeRack(response));
  }

  playTileSimulation(tiles: PlayerTile[]): Promise<Rack> {
    return this.https.post<RestBoard>(backurl+'/Games/PlayTilesSimulation/', tiles, {headers})
      .toPromise().then();
  }

  swapTile(tiles: PlayerTileToSwap[]): Promise<Rack> {
    return this.https.post<RestBag>(backurl+'/Games/SwapTiles/', tiles, {headers})
      .toPromise().then();
  }

  skipTurn(playerId: number): Promise<Rack> {
    const player = {id: playerId};
    return this.https.post<RestSkipTurn>(backurl+'/Games/SkipTurn/', player, {headers})
      .toPromise().then();
  }

  getListGames(): Promise<ListGamedId> {
    return this.https.get<number[]>(backurl+'/Games/ListGameId/', {headers})
      .toPromise().then(response => toListGamedId(response));
  }

  getUsers(): Promise<ListUsersId> {
    return this.https.get<number[]>(backurl+'/Games/ListUsersId/', {headers})
      .toPromise().then(response => toListUsersId(response));
  }

  getGamesByUserId(userId: number): Promise<ListGamedId> {
    return this.https.post<number[]>(backurl+'/Games/ListGamesByUserId/' + userId, {headers})
      .toPromise().then(response => toListGamedId(response));
  }


  newGame(players: number[]): Promise<number[]> {
    return this.https.post<Player>(backurl+'/Games/', players).toPromise().then();
  }

  getPlayerNameToPlay(gameId: number): Observable<string> {
    return this.https.get<string>(backurl+'/Games/GetPlayerNameTurn/' + gameId,
      {responseType: 'text' as 'json'});

  }

  getWinners(gameId: number): Promise<any> {
    return this.https.post<any>(backurl+'/Games/Winners/', [gameId], {headers})
      .toPromise().then();
  }
}


