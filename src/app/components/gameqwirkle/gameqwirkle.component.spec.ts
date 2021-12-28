import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameqwirkleComponent } from './gameqwirkle.component';
import { toRarrange } from '../../../domain/SetPositionTile';
import { Player, RestTilesPlay } from '../../../domain/player';
import { toTileviewModel } from '../../../domain/tiles';
import { PanZoomModel } from 'ngx-panzoom';
import { Tile } from '../../../domain/Tile';
import HttpTileRepositoryService from '../../../infra/httpRequest/http-tile-repository.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from '../../auth/auth.guard';

describe('GameqwirkleComponent', () => {
    let app: GameqwirkleComponent;
    let fixture: ComponentFixture<GameqwirkleComponent>;
    let service: HttpTileRepositoryService;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [HttpTileRepositoryService, AuthGuard]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameqwirkleComponent);
        app = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(app).toBeTruthy();
    });
    describe('init app', () => {
        it('should create the app', () => {
            expect(app.board).toEqual([]);
            expect(app).toBeTruthy();
        });

        it(`should have as title 'qwirkle'`, () => {
            expect(app.rack).toEqual([]);

            expect(app.bag).toEqual([]);
            expect(app.plate).toEqual([[]]);
            expect(app.playerNameToPlay).toEqual('');
            expect(app.nameToTurn).toEqual('');
            expect(app.playTile).toEqual([]);
            expect(app.swapTile).toEqual([]);
            expect(app.score).toEqual({
                code: 1,
                newRack: [],
                points: 0,
                tilesPlayed: []
            });
            expect(app.voidTile).toEqual([
                { disabled: false, shape: 0, color: 0, y: 0, x: 0 }
            ]);
            expect(app.players).toEqual([]);
            expect(app.games).toEqual({ listGameId: [] });
            expect(app.users).toEqual({ listUsersId: [] });
            expect(app.winner).toEqual('');
            expect(app.title).toEqual('qwirkle');
        });

        it('should reset the paramêtre', () => {
            expect(app.board).toEqual([]);
            expect(app.nameToTurn).toEqual('');
            expect(app.player).toEqual({
                gameId: 0,
                gamePosition: 0,
                id: 0,
                isTurn: true,
                lastTurnPoints: 0,
                points: 0,
                pseudo: '',
                rack: {
                    tiles: []
                },
                userId: 0
            });
            expect(app.panZoomConfigOptions).toEqual({
                zoomLevels: 10,
                scalePerZoomLevel: 2,
                zoomStepDuration: 0.2,
                freeMouseWheelFactor: 0.01,
                zoomToFitZoomLevelFactor: 0.9,
                dragMouseButton: 'right'
            });
            expect(app.playTileTempory).toEqual([]);
        });
        it('should rearrange rack ', () => {
            const rack = [
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
                    rackPosition: 0,

                    color: 2,
                    shape: 6
                },
                {
                    rackPosition: 2,

                    color: 1,
                    shape: 3
                }
            ];
            expect(toRarrange(rack)).toEqual([
                {
                    color: 2,
                    disabled: true,

                    shape: 3,
                    x: 0,
                    y: 0
                },
                {
                    color: 1,
                    disabled: true,

                    shape: 4,
                    x: 1,
                    y: 0
                },
                {
                    color: 6,
                    disabled: true,

                    shape: 2,
                    x: 2,
                    y: 0
                },
                {
                    color: 5,
                    disabled: true,

                    shape: 6,
                    x: 3,
                    y: 0
                },
                {
                    color: 2,
                    disabled: true,

                    shape: 6,
                    x: 4,
                    y: 0
                },
                {
                    color: 1,
                    disabled: true,

                    shape: 3,
                    x: 5,
                    y: 0
                }
            ]);
            const player: Player = {
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
                    ]
                },

                isTurn: true
            };
            expect(toTileviewModel(player)).toEqual([
                {
                    PlayerId: 3,
                    color: 2,
                    shape: 3
                },
                {
                    PlayerId: 3,
                    color: 1,
                    shape: 4
                },
                {
                    PlayerId: 3,
                    color: 6,
                    shape: 2
                },
                {
                    PlayerId: 3,
                    color: 5,
                    shape: 6
                },
                {
                    PlayerId: 3,
                    color: 1,
                    shape: 3
                },
                {
                    PlayerId: 3,
                    color: 2,
                    shape: 6
                }
            ]);
        });
        it('should give the style of line style', () => {
            expect(app.getPawStyle(1)).toEqual('translate(-65px,15px)');
        });
        it('should resetZoomToFit ngafterviewInit', () => {
            app.ngAfterViewInit();

            expect(app.panzoomConfig.initialZoomToFit).toEqual({
                x: 0,
                y: 0,
                width: 0,
                height: 0
            });
        });
        it('should receivePlayersInGame ', () => {
            const players: RestTilesPlay[] = [
                {
                    playerId: 1,
                    x: 0,
                    y: 0
                }
            ];
            const log = jest.spyOn(global.console, 'log');
            app.receivePlayersInGame(players);

            expect(log).toHaveBeenCalledWith('playerId 1 is in the game');
        });
        it('should receiveTilesSwapped ', () => {
            const log = jest.spyOn(global.console, 'log');
            app.receiveTilesSwapped(1);

            expect(log).toHaveBeenCalledWith('player 1has swapped some tiles');
        });
        it('should receivePlayerIdTurn ', () => {
            const log = jest.spyOn(global.console, 'log');
            app.receivePlayerIdTurn(1);

            expect(log).toHaveBeenCalled();
        });
        it('should receiveGameOver ', () => {
            const log = jest.spyOn(global.console, 'log');
            app.receiveGameOver([1]);

            expect(log).toHaveBeenCalledWith('playerId 1 has win the game');
        });

        it('should receiveTilesPlayed ', () => {
            app.receiveTilesPlayed(1, 1, [1]);
            expect(app.player.id).toEqual(0);
        });
        it('should change model zoom ', () => {
            const panzoomlevel: PanZoomModel = { pan: { x: 0, y: 0 }, zoomLevel: 0 };
            app.onModelChanged(panzoomlevel);

            expect(app.scale).toEqual(0.25);
        });
        it('should give y min in board style', () => {
            app.board = [
                {
                    color: 1,
                    disabled: false,
                    shape: 2,
                    x: 3,
                    y: -1
                },
                {
                    color: 1,
                    disabled: false,
                    shape: 5,
                    x: 4,
                    y: -1
                },
                {
                    color: 3,
                    disabled: false,
                    shape: 4,
                    x: 7,
                    y: 3
                },
                {
                    color: 4,
                    disabled: false,
                    shape: 1,
                    x: 2,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,
                    shape: 3,
                    x: 1,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,
                    shape: 6,
                    x: 3,
                    y: 2
                }
            ];
            expect(app.getYmin()).toEqual(-1);
            expect(app.getYmax()).toEqual(3);
            expect(app.getXmin()).toEqual(1);
            expect(app.getXmax()).toEqual(7);
        });

        it('should zoom in rect to fit ymin 100 ', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.newrect(100, 100, 10, 10, 10, 10)).toEqual({
                height: 150.01,
                width: 90.01,
                x: 205,
                y: -10
            });
            expect(appProto.isInRightBottom(100, 100, 10, 10, 10, 10)).toEqual({
                height: 100,
                width: 0,
                x: 250,
                y: -100
            });
        });
        it('should zoom in rect to fit ymin -100 ', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.newrect(-100, 100, 10, 10, 10, 10)).toEqual({
                height: 193.333_333_333_333_34,
                width: 90.01,
                x: 205,
                y: -10
            });
            expect(appProto.isInRightBottom(100, 100, 10, 10, 10, 10)).toEqual({
                height: 100,
                width: 0,
                x: 250,
                y: -100
            });
        });
        it('should zoom in rect to fit ymin 0 ', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.newrect(0, 100, 10, 10, 10, 10)).toEqual({
                height: 16.676_666_666_666_67,
                width: 90.01,
                x: 205,
                y: -10
            });
            expect(appProto.isInRightBottom(100, 100, 10, 10, 10, 10)).toEqual({
                height: 100,
                width: 0,
                x: 250,
                y: -100
            });
        });
        it('should zoom in rect to fit xmin -100 ', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.newrect(-100, -100, 10, 10, 10, 10)).toEqual({
                height: 193.333_333_333_333_34,
                width: 110.01,
                x: 205,
                y: -10
            });
            expect(appProto.isInRightBottom(100, 100, 10, 10, 10, 10)).toEqual({
                height: 100,
                width: 0,
                x: 250,
                y: -100
            });
        });
        it('should zoom in rect to fit xmin 0 ', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.newrect(0, 0, 10, 10, 10, 10)).toEqual({
                height: 26.666_666_666_666_668,
                width: 10,
                x: 205,
                y: -10
            });
            expect(appProto.isInRightBottom(100, 100, 10, 10, 10, 10)).toEqual({
                height: 100,
                width: 0,
                x: 250,
                y: -100
            });
        });
        it('should give the image of tile', () => {
            const tile: Tile = {
                color: 5,
                disabled: false,
                shape: 6,
                x: 3,
                y: 2
            };
            expect(app.getRackTileImage(tile)).toEqual(
                '../../assets/img/OrangeEightPointStar.svg'
            );
        });
        it('should  give the line style with tile', () => {
            const tile: Tile[] = [
                {
                    color: 5,
                    disabled: false,
                    shape: 6,
                    x: 3,
                    y: 2
                }
            ];
            expect(app.getLineStyle(tile, 1)).toEqual('translate(0px,100px)');
        });
        it('should  give the line style with tile empty', () => {
            const tile: Tile[] = [];
            expect(app.getLineStyle(tile, 0)).toEqual('');
        });
        it('should zoom in rect to fit height -100 right bottom', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.isInRightBottom(100, -100, 30, 10, -30, 10)).toEqual({
                height: -766.666_666_666_666_6,
                width: 200,
                x: 250,
                y: 100
            });
        });
        it('should zoom in rect to fit width 100', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.isInRightTop(100, 100, 10, 10, 10, 10)).toEqual({
                height: 0.1,
                width: 0.1,
                x: 250,
                y: -100
            });
        });
        it('should zoom in rect to fit height -100', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.isInRightTop(100, -100, 30, 10, -30, 10)).toEqual({
                height: -666.766_666_666_666_7,
                width: 200.1,
                x: 250,
                y: 100
            });
        });
        it('should zoom in rect to fit width 100 isInLeft', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.isInLeft(100, 100, 10, 10, 10, 10)).toEqual({
                height: 100,
                width: 0.1,
                x: 250,
                y: -100
            });
        });
        it('should zoom in rect to fit height -100 isInLeft', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.isInLeft(100, -100, 30, 10, -30, 10)).toEqual({
                height: -766.666_666_666_666_6,
                width: 200.1,
                x: 250,
                y: 100
            });
        });
    });
    describe('autoZoom', () => {
        it('should autozoom when game with xmax', () => {
            app.board = [
                {
                    color: 1,
                    disabled: false,
                    shape: 2,
                    x: 3,
                    y: -1
                },
                {
                    color: 1,
                    disabled: false,
                    shape: 5,
                    x: 4,
                    y: -1
                },
                {
                    color: 3,
                    disabled: false,
                    shape: 4,
                    x: 7,
                    y: -3
                },
                {
                    color: 4,
                    disabled: false,
                    shape: 1,
                    x: -2,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,
                    shape: 3,
                    x: 1,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,
                    shape: 6,
                    x: 3,
                    y: -2
                }
            ];
            app.autoZoom();
            expect(app.panzoomConfig.initialZoomToFit).toEqual({
                height: 0,
                width: 0,
                x: 0,
                y: 0
            });
            expect(app.board).toEqual([
                {
                    color: 1,
                    disabled: false,
                    shape: 2,
                    x: 3,
                    y: -1
                },
                {
                    color: 1,
                    disabled: false,
                    shape: 5,
                    x: 4,
                    y: -1
                },
                {
                    color: 3,
                    disabled: false,
                    shape: 4,
                    x: 7,
                    y: -3
                },
                {
                    color: 4,
                    disabled: false,
                    shape: 1,
                    x: -2,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,
                    shape: 3,
                    x: 1,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,
                    shape: 6,
                    x: 3,
                    y: -2
                }
            ]);
        });
        it('should autozoom when game with ymin>=0 xmin<=0', () => {
            app.board = [
                {
                    color: 1,
                    disabled: false,
                    shape: 2,
                    x: -3,
                    y: 0
                },
                {
                    color: 1,
                    disabled: false,
                    shape: 5,
                    x: -4,
                    y: 2
                },
                {
                    color: 3,
                    disabled: false,
                    shape: 4,
                    x: -7,
                    y: 3
                },
                {
                    color: 4,
                    disabled: false,
                    shape: 1,
                    x: -2,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,
                    shape: 3,
                    x: -1,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,
                    shape: 6,
                    x: -3,
                    y: 4
                }
            ];
            app.autoZoom();
            expect(app.panzoomConfig.initialZoomToFit).toEqual({
                height: 0,
                width: 0,
                x: 0,
                y: 0
            });
            expect(app.board).toEqual([
                {
                    color: 1,
                    disabled: false,
                    shape: 2,
                    x: -3,
                    y: 0
                },
                {
                    color: 1,
                    disabled: false,
                    shape: 5,
                    x: -4,
                    y: 2
                },
                {
                    color: 3,
                    disabled: false,
                    shape: 4,
                    x: -7,
                    y: 3
                },
                {
                    color: 4,
                    disabled: false,
                    shape: 1,
                    x: -2,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,
                    shape: 3,
                    x: -1,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,
                    shape: 6,
                    x: -3,
                    y: 4
                }
            ]);
        });
        it('should autozoom when game', () => {
            app.board = [];
            app.autoZoom().then();
            expect(app.panzoomConfig.initialZoomToFit).toEqual({
                height: 0,
                width: 0,
                x: 0,
                y: 0
            });
            expect(app.board).toEqual([]);
        });
    });
});
