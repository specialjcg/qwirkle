import { Injectable } from '@angular/core';
import { Login } from '../../domain/Tile';
import {
    BoardGame,
    ListGamedId,
    ListUsersId,
    Player,
    Rack,
    RestBag,
    RestBoard,
    RestRack,
    SkipTurnViewModel,
    toBoard,
    toChangeRack
} from '../../domain/player';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TileViewModel } from '../../domain/tiles';
import { environment } from '../../environments/environment';
import { Register } from '../../domain/register';
import {Color} from "../../domain/Color";
import {Shape} from "../../domain/Shape";

export const backurl = environment.backend.baseURL;
const headers = new HttpHeaders()
    .set('Access-Control-Allow-Origin', '*')
    .set('Content-Type', 'application/json; charset=utf-8');

const httpOptions = { headers: headers, withCredentials: true };

const toCsharp = (players: string[]) => ({Opponent1: players[0], Opponent2: players[0], Opponent3: players[0]});

@Injectable({
    providedIn: 'root'
})
export default class HttpTileRepositoryService {
    private loginusername = '';

    constructor(private https: HttpClient) {}

    LoginUser(login: Login): Observable<boolean> {
        localStorage.setItem('loginusername', login.userName);
        this.loginusername = login.userName;
        return this.https.post<boolean>(backurl + '/User/Login/', login, httpOptions);
    }

    LogGuest(): Observable<boolean> {
        return this.https.get<boolean>(backurl + '/User/RegisterGuest/', httpOptions);
    }

    getUserName(): string {
        return <string>localStorage.getItem('loginusername');
    }

    setRegister(register: Register): Observable<boolean> {
        return this.https.post<boolean>(
            backurl + '/User/Register',
            register,
            httpOptions
        );
    }

    async LogoutUser(): Promise<boolean> {
        return this.https
            .post<boolean>(backurl + '/User/Logout/','', httpOptions)
            .toPromise()
            .then();
    }

    getGame(GameId: number): Promise<BoardGame> {
        return this.https
            .get<RestBoard>(backurl + '/Game/' + GameId, httpOptions)
            .toPromise()
            .then((response) => {
                return toBoard(response);
            });
    }

    getPlayer(gameId: number): Promise<Player> {
        return this.https
            .get<string>(backurl + '/Player/ByGameId/' + gameId, httpOptions)
            .toPromise()
            .then();
    }

    playTile(tiles: { GameId: number; Tile: { color: Color; shape: Shape }; Coordinate: { X: number; Y: number } }[]): Promise<Rack> {
        return this.https
            .post<RestBoard>(backurl + '/Action/PlayTiles/', tiles, httpOptions)
            .toPromise()
            .then();
    }

  rackChangeOrder(rack: { GameId: number; Tile: { color: Color; shape: Shape }; RackPosition: number }[]): Promise<Rack> {
        return this.https
            .post<RestRack>(backurl + '/Action/ArrangeRack/', rack, httpOptions)
            .toPromise()
            .then((response) => toChangeRack(response));
    }

  playTileSimulation(tiles: { GameId: number; Tile: { color: Color; shape: Shape }; Coordinate: { X: number; Y: number } }[]): Promise<RestRack> {
        return this.https
            .post<RestRack>(backurl + '/Action/PlayTilesSimulation/', tiles, httpOptions)
            .toPromise()
            .then();
    }

  swapTile(tiles: { GameId: number; Tile: { color: Color; shape: Shape }; RackPosition: number }[]): Promise<Rack> {
        return this.https
            .post<RestBag>(backurl + '/Action/SwapTiles/', tiles, httpOptions)
            .toPromise()
            .then();
    }

    skipTurn(gameId: number): Promise<Rack> {
        const skipTurnViewModel = { gameId: gameId };
        return this.https
            .post<SkipTurnViewModel>(
                backurl + '/Action/SkipTurn/',
                skipTurnViewModel,
                httpOptions
            )
            .toPromise()
            .then();
    }

    getGames(): Observable<number[]> {
        return this.https.get<number[]>(backurl + '/Game/UserGamesIds/', httpOptions);
    }

    newGame(players: string[]): Promise<any> {
        return this.https
            .post<string[]>(backurl + '/Game/New/', toCsharp(players), httpOptions)
            .toPromise()
            .then();
    }

    getPlayerNameTurn(gameId: number): Observable<string> {
        const httpNameTurnoptions = {
            headers: headers,
            withCredentials: true,
            responseType: 'text' as 'json'
        };
        return this.https.get<string>(
            backurl + '/Player/NameTurn/' + gameId,
            httpNameTurnoptions
        );
    }

    getWinners(gameId: number): Promise<number[]> {
        return this.https
            .get<number[]>(backurl + '/Player/Winners/' + gameId, httpOptions)
            .toPromise()
            .then();
    }

    getBot(gameId: number): Promise<never> {
        return this.https
            .get<never>(backurl + '/Ai/BestMoves/' + gameId, httpOptions)
            .toPromise()
            .then();
    }

    listFavoriteGamer(): Observable<string[]> {
        return this.https.get<string[]>(
            backurl + '/User/BookmarkedOpponents/',
            httpOptions
        );
    }

    addFavoriteGamer(friendName: string): Observable<string> {
        return this.https.get<string>(
            backurl + '/User/AddBookmarkedOpponent/'+
            friendName ,
            httpOptions
        );
    }
}
