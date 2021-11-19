import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameqwirkleComponent } from './gameqwirkle.component';
import { AppComponent } from '../../app.component';
import { toRarrange } from '../../../domain/SetPositionTile';
import { Player, RestTilesPlay } from '../../../domain/player';
import { toTileviewModel } from '../../../domain/tiles';
import { PanZoomModel } from 'ngx-panzoom';
import { Tile } from '../../../domain/Tile';
import HttpTileRepositoryService from '../../../infra/httpRequest/http-tile-repository.service';
import { TilePawnComponent } from '../../TilePawn/tile-pawn.component';
import { TotalScoreComponent } from '../../total-score/total-score.component';
import { ResultScoreComponent } from '../../result-score/result-score.component';
import { NewUserComponent } from '../../new-user/new-user.component';
import { ChoosePlayerComponent } from '../../choose-player/choose-player.component';
import { ChooseGameComponent } from '../../choose-game/choose-game.component';
import { NewGameComponent } from '../../new-game/new-game.component';
import { GiveTemporyScoreComponent } from '../../give-tempory-score/give-tempory-score.component';
import { WinnerComponent } from '../../winner/winner.component';
import { PickComponent } from '../../pick/pick.component';
import { LogInComponent } from '../log-in/log-in.component';
import { RegisterComponent } from '../register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../../angular-material.module';
import { RouterModule } from '@angular/router';

describe('GameqwirkleComponent', () => {
    let app: GameqwirkleComponent;
    let fixture: ComponentFixture<GameqwirkleComponent>;
    let service: HttpTileRepositoryService;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                TilePawnComponent,
                TotalScoreComponent,
                ResultScoreComponent,
                NewUserComponent,
                ChoosePlayerComponent,
                ChooseGameComponent,
                NewGameComponent,
                GiveTemporyScoreComponent,
                WinnerComponent,
                PickComponent,
                LogInComponent,
                RegisterComponent,
                GameqwirkleComponent
            ],
            imports: [BrowserAnimationsModule, AngularMaterialModule, RouterModule],
            providers: [HttpTileRepositoryService]
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
                { disabled: false, id: 0, shape: 0, color: 0, y: 0, x: 0 }
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
                id: 0,
                pseudo: '',
                gameId: 0,
                gamePosition: 0,
                points: 0,
                lastTurnPoints: 0,
                rack: { tiles: [] },
                isTurn: true
            });
            expect(app['panZoomConfigOptions']).toEqual({
                zoomLevels: 10,
                scalePerZoomLevel: 2,
                zoomStepDuration: 0.2,
                freeMouseWheelFactor: 0.01,
                zoomToFitZoomLevelFactor: 0.9,
                dragMouseButton: 'right'
            });
            expect(app['playTileTempory']).toEqual([]);
        });
        it('should rearrange rack ', () => {
            const rack = [
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
                    rackPosition: 0,
                    id: 87,
                    color: 2,
                    shape: 6
                },
                {
                    rackPosition: 2,
                    id: 77,
                    color: 1,
                    shape: 3
                }
            ];
            expect(toRarrange(rack)).toEqual([
                {
                    color: 2,
                    disabled: true,
                    id: 71,
                    shape: 3,
                    x: 0,
                    y: 0
                },
                {
                    color: 1,
                    disabled: true,
                    id: 5,
                    shape: 4,
                    x: 1,
                    y: 0
                },
                {
                    color: 6,
                    disabled: true,
                    id: 31,
                    shape: 2,
                    x: 2,
                    y: 0
                },
                {
                    color: 5,
                    disabled: true,
                    id: 105,
                    shape: 6,
                    x: 3,
                    y: 0
                },
                {
                    color: 2,
                    disabled: true,
                    id: 87,
                    shape: 6,
                    x: 4,
                    y: 0
                },
                {
                    color: 1,
                    disabled: true,
                    id: 77,
                    shape: 3,
                    x: 5,
                    y: 0
                }
            ]);
            const player: Player = {
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
            expect(toTileviewModel(player)).toEqual([
                {
                    TileId: 71,
                    X: 5,
                    Y: 0,
                    playerId: 3
                },
                {
                    TileId: 5,
                    X: 1,
                    Y: 0,
                    playerId: 3
                },
                {
                    TileId: 31,
                    X: 0,
                    Y: 0,
                    playerId: 3
                },
                {
                    TileId: 105,
                    X: 1,
                    Y: 0,
                    playerId: 3
                },
                {
                    TileId: 77,
                    X: 2,
                    Y: 0,
                    playerId: 3
                },
                {
                    TileId: 87,
                    X: 0,
                    Y: 0,
                    playerId: 3
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
                    tileId: 0,
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
                    id: 2,
                    shape: 2,
                    x: 3,
                    y: -1
                },
                {
                    color: 1,
                    disabled: false,
                    id: 5,
                    shape: 5,
                    x: 4,
                    y: -1
                },
                {
                    color: 3,
                    disabled: false,
                    id: 16,
                    shape: 4,
                    x: 7,
                    y: 3
                },
                {
                    color: 4,
                    disabled: false,
                    id: 19,
                    shape: 1,
                    x: 2,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,
                    id: 21,
                    shape: 3,
                    x: 1,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,
                    id: 30,
                    shape: 6,
                    x: 3,
                    y: 2
                }
            ];
            expect(app['getYmin']()).toEqual(-1);
            expect(app['getYmax']()).toEqual(3);
            expect(app['getXmin']()).toEqual(1);
            expect(app['getXmax']()).toEqual(7);
        });

        it('should zoom in rect to fit ymin 100 ', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.newrect(100, 100, 10, 10, 10, 10)).toEqual({
                height: 150.01,
                width: 90.01,
                x: 550,
                y: -400
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
                height: 183.343_333_333_333_33,
                width: 90.01,
                x: 650,
                y: -400
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
                x: 550,
                y: -400
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
                height: 183.343_333_333_333_33,
                width: 110.01,
                x: 650,
                y: -400
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
                id: 30,
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
                    id: 30,
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
                x: 550,
                y: -400
            });
        });
        it('should zoom in rect to fit height -100', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.isInRightTop(100, -100, 30, 10, -30, 10)).toEqual({
                height: -666.766_666_666_666_7,
                width: 200.1,
                x: 550,
                y: -400
            });
        });
        it('should zoom in rect to fit width 100 isInLeft', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.isInLeft(100, 100, 10, 10, 10, 10)).toEqual({
                height: 0.1,
                width: 0.1,
                x: 650,
                y: -400
            });
        });
        it('should zoom in rect to fit height -100 isInLeft', () => {
            const appProto = Object.getPrototypeOf(app);
            expect(appProto.isInLeft(100, -100, 30, 10, -30, 10)).toEqual({
                height: -666.766_666_666_666_7,
                width: 200.1,
                x: 650,
                y: -400
            });
        });
    });
    describe('autoZoom', () => {
        it('should autozoom when game with xmin', () => {
            app.board = [
                {
                    color: 1,
                    disabled: false,
                    id: 2,
                    shape: 2,
                    x: -3,
                    y: 5
                },
                {
                    color: 1,
                    disabled: false,
                    id: 5,
                    shape: 5,
                    x: -4,
                    y: 4
                },
                {
                    color: 3,
                    disabled: false,
                    id: 16,
                    shape: 4,
                    x: -7,
                    y: 3
                },
                {
                    color: 4,
                    disabled: false,
                    id: 19,
                    shape: 1,
                    x: -2,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,
                    id: 21,
                    shape: 3,
                    x: -1,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,
                    id: 30,
                    shape: 6,
                    x: -3,
                    y: 2
                }
            ];
            app.autoZoom().then();
            app['panZoomAPI'].zoomToFit({ height: 500, width: 500, x: 100, y: 100 });
        });
        it('should autozoom when game with xmin and board empty', () => {
            app.board = [];
            app.autoZoom().then();
            expect(app.panzoomModel.pan).toEqual({ x: 0, y: 0 });
        });
        it('should autozoom when game with xmax', () => {
            app.board = [
                {
                    color: 1,
                    disabled: false,
                    id: 2,
                    shape: 2,
                    x: 3,
                    y: -1
                },
                {
                    color: 1,
                    disabled: false,
                    id: 5,
                    shape: 5,
                    x: 4,
                    y: -1
                },
                {
                    color: 3,
                    disabled: false,
                    id: 16,
                    shape: 4,
                    x: 7,
                    y: -3
                },
                {
                    color: 4,
                    disabled: false,
                    id: 19,
                    shape: 1,
                    x: -2,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,
                    id: 21,
                    shape: 3,
                    x: 1,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,
                    id: 30,
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
                    id: 2,
                    shape: 2,
                    x: 3,
                    y: -1
                },
                {
                    color: 1,
                    disabled: false,
                    id: 5,
                    shape: 5,
                    x: 4,
                    y: -1
                },
                {
                    color: 3,
                    disabled: false,
                    id: 16,
                    shape: 4,
                    x: 7,
                    y: -3
                },
                {
                    color: 4,
                    disabled: false,
                    id: 19,
                    shape: 1,
                    x: -2,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,
                    id: 21,
                    shape: 3,
                    x: 1,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,
                    id: 30,
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
                    id: 2,
                    shape: 2,
                    x: -3,
                    y: 0
                },
                {
                    color: 1,
                    disabled: false,
                    id: 5,
                    shape: 5,
                    x: -4,
                    y: 2
                },
                {
                    color: 3,
                    disabled: false,
                    id: 16,
                    shape: 4,
                    x: -7,
                    y: 3
                },
                {
                    color: 4,
                    disabled: false,
                    id: 19,
                    shape: 1,
                    x: -2,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,
                    id: 21,
                    shape: 3,
                    x: -1,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,
                    id: 30,
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
                    id: 2,
                    shape: 2,
                    x: -3,
                    y: 0
                },
                {
                    color: 1,
                    disabled: false,
                    id: 5,
                    shape: 5,
                    x: -4,
                    y: 2
                },
                {
                    color: 3,
                    disabled: false,
                    id: 16,
                    shape: 4,
                    x: -7,
                    y: 3
                },
                {
                    color: 4,
                    disabled: false,
                    id: 19,
                    shape: 1,
                    x: -2,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,
                    id: 21,
                    shape: 3,
                    x: -1,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,
                    id: 30,
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