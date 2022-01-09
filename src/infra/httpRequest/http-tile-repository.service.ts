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

export const backurl = environment.backend.baseURL;
const headers = new HttpHeaders()
    .set('Access-Control-Allow-Origin', '*')
    .set('Content-Type', 'application/json; charset=utf-8');

const httpOptions = { headers: headers, withCredentials: true };

@Injectable({
    providedIn: 'root'
})
export default class HttpTileRepositoryService {
    constructor(private https: HttpClient) {}

    LoginUser(login: Login): Observable<boolean> {
        return this.https.post<boolean>(backurl + '/User/Login/', login, httpOptions);
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
            .get<boolean>(backurl + '/User/Logout', httpOptions)
            .toPromise()
            .then();
    }

    //todo : to remove
    whoAmI(): Observable<number> {
        return this.https.get<number>(backurl + '/User/WhoAmI/', httpOptions);
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

    playTile(tiles: TileViewModel[]): Promise<Rack> {
        return this.https
            .post<RestBoard>(backurl + '/Action/PlayTiles/', tiles, httpOptions)
            .toPromise()
            .then();
    }

    rackChangeOrder(rack: TileViewModel[]): Promise<Rack> {
        return this.https
            .post<RestRack>(backurl + '/Action/ArrangeRack/', rack, httpOptions)
            .toPromise()
            .then((response) => toChangeRack(response));
    }

    playTileSimulation(tiles: TileViewModel[]): Promise<Rack> {
        return this.https
            .post<RestBoard>(backurl + '/Action/PlayTilesSimulation/', tiles, httpOptions)
            .toPromise()
            .then();
    }

    swapTile(tiles: TileViewModel[]): Promise<Rack> {
        return this.https
            .post<RestBag>(backurl + '/Action/SwapTiles/', tiles, httpOptions)
            .toPromise()
            .then();
    }

    skipTurn(gameId: number): Promise<Rack> {
        let skipTurnViewModel = { gameId: gameId };
        return this.https
            .post<SkipTurnViewModel>(backurl + '/Action/SkipTurn/', skipTurnViewModel, httpOptions)
            .toPromise()
            .then();
    }

    getGames(): Observable<number[]> {
        return this.https.get<number[]>(backurl + '/Game/UserGamesIds/', httpOptions);
    }

    newGame(players: string[]): Promise<string[]> {
        return this.https
            .post<string[]>(backurl + '/Game/New/', players, httpOptions)
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
}
