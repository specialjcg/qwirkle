import {Injectable} from '@angular/core';
import {Login, PlayerTile, PlayerTileToSwap} from '../../domain/Tile';
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
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TileViewModel} from '../../domain/tiles';
import {environment} from "../../environments/environment.prod";
export const backurl=environment.backend.baseURL
const headers = new HttpHeaders()
  .set('Access-Control-Allow-Origin', '*')
  .set('Content-Type', 'application/json; charset=utf-8');

const httpOptions = {headers: headers, withCredentials: true};

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

  LoginUser(login : Login) {
    return this.https.post<boolean>(backurl+'/User/Login/', login, httpOptions)
      .toPromise().then();
  }

  LogoutUser() {
    return this.https.get<boolean>(backurl+'/User/Logout/', httpOptions)
      .toPromise().then();
  }

  //todo : to remove
  whoAmI(): number | PromiseLike<number> {
    return this.https.get<RestBoard>(backurl+'/User/WhoAmI', httpOptions)
      .toPromise().then();
  }

  getGame(GameId: number): Promise<BoardGame> {
    return this.https.get<RestBoard>(backurl+'/Game/' + GameId, httpOptions)
      .toPromise().then(response => {
        console.log(response);
        return toBoard(response)
      });
  }

  getPlayer(gameId: number, userId: number): Promise<Player> {
    return this.https.get<string>(backurl+'/Player/' + gameId + '/' + userId, httpOptions)
      .toPromise().then();
  }

  playTile(tiles: PlayerTile[]): Promise<Rack> {
    return this.https.post<RestBoard>(backurl+'/Action/PlayTiles/', tiles, httpOptions)
      .toPromise().then();
  }

  rackChangeOrder(rack: TileViewModel[]): Promise<Rack> {
    return this.https.post<RestRack>(backurl+'/Action/ArrangeRack/', rack, httpOptions)
      .toPromise().then(response => toChangeRack(response));
  }

  playTileSimulation(tiles: PlayerTile[]): Promise<Rack> {
    return this.https.post<RestBoard>(backurl+'/Action/PlayTilesSimulation/', tiles, httpOptions)
      .toPromise().then();
  }

  swapTile(tiles: PlayerTileToSwap[]): Promise<Rack> {
    return this.https.post<RestBag>(backurl+'/Action/SwapTiles/', tiles, httpOptions)
      .toPromise().then();
  }

  skipTurn(playerId: number): Promise<Rack> {
    const player = {id: playerId};
    return this.https.post<RestSkipTurn>(backurl+'/Action/SkipTurn/', player, httpOptions)
      .toPromise().then();
  }

  getGames(): Promise<ListGamedId> {
    return this.https.get<number[]>(backurl+'/Game/GamesIds/', httpOptions)
      .toPromise().then(response => toListGamedId(response));
  }

  getUsers(): Promise<ListUsersId> {
    return this.https.get<number[]>(backurl+'/Admin/AllUsersIds/', httpOptions)
      .toPromise().then(response => toListUsersId(response));
  }

  getGamesByUserId(userId: number): Promise<ListGamedId> {
    return this.https.post<number[]>(backurl+'/Game/GamesByUserId/' + userId, httpOptions)
      .toPromise().then(response => toListGamedId(response));
  }

  getUserGames(): Promise<ListGamedId> {
    return this.https.get<number[]>(backurl+'/Game/UserGames/', httpOptions)
      .toPromise().then(response => toListGamedId(response));
  }


  newGame(players: number[]): Promise<number[]> {
    return this.https.post<Player>(backurl+'/Game/New/', players).toPromise().then();
  }

  getPlayerNameTurn(gameId: number): Observable<string> {
    return this.https.get<string>(backurl+'/Player/GetPlayerNameTurn/' + gameId,
      {responseType: 'text' as 'json'});

  }

  getWinners(gameId: number): Promise<any> {
    return this.https.get<any>(backurl+'/Player/Winners/' + gameId, httpOptions)
      .toPromise().then();
  }
}


