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
import {BoardGame, ListGamedId, ListUsersId, Player, TilesOnBag} from '../../domain/player';

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
        const mockBoard: BoardGame = { boards: [], players: [], bag: { tiles: [] } };
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

        const request = httpMock.expectOne(backurl + '/Player/NameTurn/' + 1);

        request.flush(mockBoard);
    });

    it('should give http response for get_games', () => {
        const mockListGameId = [1, 2];
        service.getGames().subscribe((res) => {
            expect(res).not.toBe(<ListGamedId>{});
            expect(res).toEqual({ listGameId: [1, 2] });
        });

        const request = httpMock.expectOne(backurl + '/Game/UserGamesIds/');

        request.flush(mockListGameId);
    });
    it('should give http response for new_games', () => {
        const mockListnewgame = ['10', '11'];
        service.newGame(['10', '11']).then((response) => {
            expect(response).not.toBe([]);
            expect(response).toEqual(['10', '11']);
        });

        const request = httpMock.expectOne(backurl + '/Game/New/');

        request.flush(mockListnewgame);
    });
    it('should give http response for get winner', () => {
        const mockListnewgame = true;
        service.getWinners(1).then((response) => {
            expect(response).not.toBe([]);
            expect(response).toEqual(true);
        });

        const request = httpMock.expectOne(backurl + '/Player/Winners/' + 1);

        request.flush(mockListnewgame);
    });

    it('should give http response for getPlayer', () => {
        const mockPlayer: Player = {
            id: 3,
            pseudo: 'Thomas',
            userId: 3,
            gameId: 3,
            gamePosition: 1,
            points: 17,
            lastTurnPoints: 0,
            rack: {
                tiles: [
                    {
                        rackPosition: 5,
                        color: 2,
                        shape: 3
                    },
                    {
                        rackPosition: 1,
                        color: 1,
                        shape: 4
                    },
                    {
                        rackPosition: 0,
                        color: 6,
                        shape: 2
                    },
                    {
                        rackPosition: 1,
                        color: 5,
                        shape: 6
                    },
                    {
                        rackPosition: 2,
                        color: 1,
                        shape: 3
                    },
                    {
                        rackPosition: 0,
                        color: 2,
                        shape: 6
                    }
                ],tilesNumber: 0
            },

            isTurn: true
        };
        service.getPlayer(1).then((response) => {
            expect(response).not.toBe(<Player>{});
            expect(response).toEqual(mockPlayer);
        });

        const request = httpMock.expectOne(backurl + '/Player/ByGameId/' + 1);

        request.flush(mockPlayer);
    });
});
