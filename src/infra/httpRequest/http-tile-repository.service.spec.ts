import { TestBed } from '@angular/core/testing';

import HttpTileRepositoryService, { backurl } from './http-tile-repository.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPanZoomModule } from 'ngx-panzoom';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { BoardGame, ListGamedId, ListUsersId, Player } from '../../domain/player';

describe('HttpTileRepositoryService', () => {
    let service: HttpTileRepositoryService;
    let httpMock: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                NgxPanZoomModule,
                BrowserAnimationsModule,
                MatButtonModule,
                HttpClientModule,
                DragDropModule,
                MatIconModule,
                MatOptionModule,
                MatSelectModule,
                MatCardModule,
                HttpClientTestingModule
            ],
            providers: [HttpTileRepositoryService]
        });
        service = TestBed.inject(HttpTileRepositoryService);

        httpMock = TestBed.inject(HttpTestingController);
    });
    afterEach(() => {
        httpMock.verify();
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should give http response for getGame', () => {
        const mockBoard: BoardGame = { boards: [], players: [] };
        service.getGame(1).then((res) => {
            expect(res).not.toBe(<BoardGame>{});
            expect(res).toEqual({ boards: [], players: [] });
        });

        const request = httpMock.expectOne(backurl + '/Game/1');

        request.flush(mockBoard);
    });
    it('should give http response for get_player_name_turn', () => {
        const mockBoard = 'coucou';
        service.getPlayerNameTurn(1).subscribe((res) => {
            expect(res).not.toBe('');
            expect(res).toEqual('');
        });

        const request = httpMock.expectOne(backurl + '/Player/GetPlayerNameTurn/' + 1);

        request.flush(mockBoard);
    });
    it('should give http response for get_player_by user Id', () => {
        const mockListuserId = [1, 2];
        service.getGamesByUserId(1).then((res) => {
            expect(res).not.toBe('');
            expect(res).toEqual({ listGameId: [1, 2] });
        });

        const request = httpMock.expectOne(backurl + '/Game/GamesByUserId/' + 1);

        request.flush(mockListuserId);
    });
    it('should give http response for get_games', () => {
        const mockListGameId = [1, 2];
        service.getGames().then((res) => {
            expect(res).not.toBe(<ListGamedId>{});
            expect(res).toEqual({ listGameId: [1, 2] });
        });

        const request = httpMock.expectOne(backurl + '/Game/GamesIds/');

        request.flush(mockListGameId);
    });
    it('should give http response for new_games', () => {
        const mockListnewgame = [10, 11];
        service.newGame([10, 11]).then((res) => {
            expect(res).not.toBe([]);
            expect(res).toEqual([10, 11]);
        });

        const request = httpMock.expectOne(backurl + '/Game/New/');

        request.flush(mockListnewgame);
    });
    it('should give http response for get winner', () => {
        const mockListnewgame = true;
        service.getWinners(1).then((res) => {
            expect(res).not.toBe([]);
            expect(res).toEqual(true);
        });

        const request = httpMock.expectOne(backurl + '/Player/Winners/' + 1);

        request.flush(mockListnewgame);
    });
    it('should give http response for new user', () => {
        const mockListUsersId = { listUsersId: [1, 2] };
        service.getUsers().then((res) => {
            expect(res).not.toBe(<ListUsersId>{});
            expect(res).toEqual({ listUsersId: { listUsersId: [1, 2] } });
        });

        const request = httpMock.expectOne(backurl + '/Admin/AllUsersIds/');

        request.flush(mockListUsersId);
    });
    it('should give http response for getPlayer', () => {
        const mockPlayer: Player = {
            id: 3,
            pseudo: 'Thomas',
            gameId: 3,
            gamePosition: 1,
            points: 17,
            lastTurnPoints: 0,
            rack: {
                tiles: [
                    {
                        rackPosition: 5,
                        id: 71,
                        color: 2,
                        shape: 3
                    },
                    {
                        rackPosition: 1,
                        id: 5,
                        color: 1,
                        shape: 4
                    },
                    {
                        rackPosition: 0,
                        id: 31,
                        color: 6,
                        shape: 2
                    },
                    {
                        rackPosition: 1,
                        id: 105,
                        color: 5,
                        shape: 6
                    },
                    {
                        rackPosition: 2,
                        id: 77,
                        color: 1,
                        shape: 3
                    },
                    {
                        rackPosition: 0,
                        id: 87,
                        color: 2,
                        shape: 6
                    }
                ]
            },

            isTurn: true
        };
        service.getPlayer(1, 1).then((res) => {
            expect(res).not.toBe(<Player>{});
            expect(res).toEqual(mockPlayer);
        });

        const request = httpMock.expectOne(backurl + '/Player/' + 1 + '/' + 1);

        request.flush(mockPlayer);
    });
});
