import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import {
    PanZoomAPI,
    PanZoomConfig,
    PanZoomConfigOptions,
    PanZoomModel
} from 'ngx-panzoom';
import { Subscription } from 'rxjs';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    getInsertTile,
    insertPosition,
    Tile,
    toNameImage,
    toPlate
} from '../../../domain/Tile';
import {
    fromSwap,
    fromBoard,
    ListGamedId,
    ListUsersId,
    Player,
    Rack,
    TilesOnBoard,
    toChangeRack
} from '../../../domain/player';
import { SignalRService } from '../../../infra/httpRequest/services/signal-r.service';
import { HttpClient } from '@angular/common/http';
import HttpTileRepositoryService from '../../../infra/httpRequest/http-tile-repository.service';
import { toRarrange, toRarrangeRack, toTiles } from '../../../domain/SetPositionTile';
import { TileViewModel } from '../../../domain/tiles';
import { ActivatedRoute, Router } from '@angular/router';

interface Rect {
    x: number; // the x0 (top left) coordinate
    y: number; // the y0 (top left) coordinate
    width: number; // the x1 (bottom right) coordinate
    height: number; // the y1 (bottom right) coordinate
}

@Component({
    selector: 'app-gameqwirkle',
    templateUrl: './gameqwirkle.component.html',
    styleUrls: ['./gameqwirkle.component.css']
})
export class GameqwirkleComponent implements OnInit {
    @ViewChild('scene', { static: false }) scene!: ElementRef;

    title = 'qwirkle';

    rack: Tile[] = [];

    board: Tile[] = [];

    swap: Tile[] = [];

    plate: Tile[][] = [[]];

    playTile: TileViewModel[] = [];

    swapTile: TileViewModel[] = [];

    score: Rack = { code: 1, tilesPlayed: [], newRack: [], points: 0 };

    voidTile: Tile[] = [{ disabled: false, shape: 0, color: 0, y: 0, x: 0 }];

    totalScore = 0;

    gameId = 0;

    userId = 0;

    player: Player = {
        id: 0,
        userId: 0,
        pseudo: '',
        gameId: 0,
        gamePosition: 0,
        points: 0,
        lastTurnPoints: 0,
        rack: { tiles: [] },
        isTurn: true
    };

    playerNameToPlay = '';

    nameToTurn = '';

    panzoomModel!: PanZoomModel;

    panZoomConfigOptions: PanZoomConfigOptions = {
        zoomLevels: 10,
        scalePerZoomLevel: 2,
        zoomStepDuration: 0.2,
        freeMouseWheelFactor: 0.01,
        zoomToFitZoomLevelFactor: 0.9,
        dragMouseButton: 'right'
    };

    panzoomConfig: PanZoomConfig = new PanZoomConfig(this.panZoomConfigOptions);

    scale = 1;

    public panZoomAPI!: PanZoomAPI;

    players: Player[] = [];

    playTileTempory: TileViewModel[] = [];

    rackTile: TileViewModel[] = [];

    skipTurnUser: TileViewModel[] = [];

    winner = '';

    bagLength = 108;

    playerIdTurn = 0;

    public users: ListUsersId = { listUsersId: [] };

    private modelChangedSubscription!: Subscription;

    private apiSubscription!: Subscription;

    constructor(
        private changeDetector: ChangeDetectorRef,
        public signalRService: SignalRService,
        private http: HttpClient,
        private serviceQwirkle: HttpTileRepositoryService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.gameId = Number(this.route.snapshot.paramMap.get('id'));

        this.signalRService.startConnection();

        this.signalRService.hubConnection.on(
            'ReceivePlayersInGame',
            (playersIds: any[]) => {
                this.receivePlayersInGame(playersIds);
            }
        );
        this.signalRService.hubConnection.on(
            'ReceiveInstantGameStarted',
            (playerNumberForStartGame: number, gameId: number) => {
                this.router.navigate(['/game/' + gameId]).then();
            }
        );
        this.signalRService.hubConnection.on(
            'ReceiveTilesPlayed',
            (playerId: number, scoredPoints: number, tilesPlayed: any[]) => {
                this.receiveTilesPlayed(playerId, scoredPoints, tilesPlayed).then();
            }
        );
        this.signalRService.hubConnection.on(
            'ReceiveTilesSwapped',
            (playerId: number) => {
                this.receiveTilesSwapped(playerId);
            }
        );
        this.signalRService.hubConnection.on(
            'ReceivePlayerIdTurn',
            (playerId: number) => {
                this.receivePlayerIdTurn(playerId);
            }
        );
        this.signalRService.hubConnection.on(
            'ReceiveGameOver',
            (winnersPlayersIds: number[]) => {
                this.receiveGameOver(winnersPlayersIds);
            }
        );
        this.modelChangedSubscription = this.panzoomConfig.modelChanged.subscribe(
            (model: PanZoomModel) => this.onModelChanged(model)
        );
        this.apiSubscription = this.panzoomConfig.api.subscribe(
            (api: PanZoomAPI) => (this.panZoomAPI = api)
        );
        if (this.gameId !== 0) this.gameChange(this.gameId);
    }

    onModelChanged(model: PanZoomModel): void {
        this.panzoomModel = model;
        this.scale = this.getCssScale(this.panzoomModel.zoomLevel);
        this.changeDetector.markForCheck();
        this.changeDetector.detectChanges();
    }

    ngAfterViewInit(): void {
        this.resetZoomToFit();

        this.changeDetector.detectChanges();
    }

    resetZoomToFit(): void {
        const shelveDisplay = document.querySelector('.container') as HTMLElement;
        const height = shelveDisplay.clientHeight;
        const width = shelveDisplay.clientWidth;
        this.panzoomConfig.initialZoomToFit = {
            x: 0,
            y: 0,
            width,
            height
        };
    }

    receivePlayersInGame = (players: any[]) => {
        for (const player of players) {
            console.log('playerId ' + player.playerId + ' is in the game'); // TODO replace log
        }
    };

    receiveTilesPlayed = async (
        playerId: number,
        scoredPoints: number,
        tilesPlayed: any[]
    ) => {
        this.game().then(() => {
            const test = !this.players.some((pl) => pl.pseudo === 'bot1')
                ? 0
                : this.players.find((pl) => pl.pseudo === 'bot1')!.id;
            if (
                playerId === test &&
                this.winner === '' &&
                this.player.pseudo === 'jc12'
            ) {
                this.Bot();
            }
        });
    };

    receiveTilesSwapped = (playerId: number) => {
        console.log('player ' + playerId + 'has swapped some tiles'); // TODO replace log
    };

    receivePlayerIdTurn = (playerId: number) => {
        this.playerIdTurn = playerId;
        this.game().then();
    };

    receiveGameOver = (winnerPlayersIds: number[]) => {
        for (const playerId of winnerPlayersIds) {
            console.log('playerId ' + playerId + ' has win the game'); // TODO replace log
        }
    };

    async autoZoom(): Promise<void> {
        this.resetZoomToFit();
        this.changeDetector.detectChanges();
        const scene = this.scene !== undefined;
        let height = 100;
        let width = 100;
        if (scene) {
            height = this.scene.nativeElement.clientHeight;
            width = this.scene.nativeElement.clientWidth;
        }

        const xmin: number = this.getXmin();
        const xmax: number = this.getXmax();
        const ymin = this.getYmin();
        const ymax = this.getYmax();

        const newRect: Rect = this.newrect(ymin, xmin, width, height, xmax, ymax);

        this.panZoomAPI.zoomToFit(newRect);

        this.changeDetector.detectChanges();
    }

    getXmin() {
        return Math.min(...this.board.map((tile) => tile.x));
    }

    getYmin(): number {
        return Math.min(...this.board.map((tile) => tile.y));
    }

    getYmax(): number {
        return Math.max(...this.board.map((tile) => tile.y));
    }

    getXmax(): number {
        return Math.max(...this.board.map((tile) => tile.x));
    }

    getRackTileImage(tile: Tile): string {
        return '../../assets/img/' + toNameImage(tile);
    }

    getLineStyle(line: Tile[], index: number): string {
        if (line[0] !== undefined) {
            return 'translate(' + 0 + 'px,' + index * 100 + 'px)';
        }
        return '';
    }

    drop(event: CdkDragDrop<Tile[], any>, index: number): void {
        this.board = insertPosition(
            this.board,
            getInsertTile(
                event.previousContainer.data[event.previousIndex],
                this.plate[index][event.currentIndex].x,
                this.plate[index][event.currentIndex].y
            ),
            this.plate[index][event.currentIndex].x
        );

        if (event.previousContainer !== event.container) {
            this.rack = this.rack.filter(
                (tile) => tile !== event.previousContainer.data[event.previousIndex]
            );
            this.swap = this.swap.filter(
                (tile) => tile !== event.previousContainer.data[event.previousIndex]
            );
        }
        this.plate = toPlate(this.board);
        this.setTemporyScore();
    }

    dropBot(tile: Tile): void {
        this.board.push(tile);

        this.removeTileInRack(tile);
        this.swapTileFromBag(tile);

        this.plate = toPlate(this.board);
        this.setTemporyScore();
    }

    private swapTileFromBag(tile: Tile) {
        for (const tilebag of this.swap) {
            const index = this.rack.indexOf(tilebag);
            if (tilebag.color === tile.color && tilebag.shape === tile.shape) {
                this.rack.splice(index, 1);
                break;
            }
        }
    }

    private removeTileInRack(tile: Tile) {
        for (const tilerack of this.rack) {
            const index = this.rack.indexOf(tilerack);
            if (tilerack.color === tile.color && tilerack.shape === tile.shape) {
                this.rack.splice(index, 1);
                break;
            }
        }
    }

    dropEmpty(event: CdkDragDrop<Tile[], any>): void {
        this.board = insertPosition(
            this.board,
            getInsertTile(event.previousContainer.data[event.previousIndex], 0, 0),
            0
        );
        if (event.previousContainer !== event.container) {
            this.rack = this.rack.filter(
                (tile) => tile !== event.previousContainer.data[event.previousIndex]
            );
        }

        this.plate = toPlate(this.board);
        this.setTemporyScore();
    }

    private setTemporyScore() {
        this.score = {
            code: 1,
            tilesPlayed: [],
            newRack: [],
            points: 0
        };
        this.playTileTempory = fromBoard(
            this.board.filter((tile) => tile.disabled),
            this.player.gameId
        );

        this.serviceQwirkle
            .playTileSimulation(this.playTileTempory)
            .then(async (resp) => {
                console.log(resp);
                this.score = toChangeRack(resp);
                this.autoZoom().then();
            });
    }

    async game(): Promise<void> {
        if (this.gameId !== 0) {
            this.serviceQwirkle.getPlayerNameTurn(this.gameId).subscribe((response) => {
                this.nameToTurn = '';
                if (this.winner === '') {
                    this.nameToTurn = response;
                }
            });

            this.serviceQwirkle.getGame(this.gameId).then((board) => {
                this.Iswinner();
                this.board = board.boards;
                this.bagLength = board.bag.tiles.length;
                this.plate = toPlate(this.board);

                this.players = board.players.sort(
                    (a, b) => a.gamePosition - b.gamePosition
                );
                this.player = board.players.find(
                    (player) => player.userId === this.player.userId
                )!;
                if (this.player.rack.tiles !== null) {
                    this.player.rack.tiles.sort(
                        (a, b) => a.rackPosition - b.rackPosition
                    );

                    this.rack = toRarrange(this.player.rack.tiles);
                }
                this.autoZoom().then();
            });
        }
    }

    async valid(): Promise<void> {
        this.playTile = fromBoard(
            this.board.filter((tile: Tile) => tile.disabled),
            this.player.gameId
        );
        this.serviceQwirkle.playTile(this.playTile).then(async (resp) => {
            this.score = resp;

            this.getPlayerIdToPlay().then();

            this.score = {
                code: 1,
                tilesPlayed: [],
                newRack: [],
                points: 0
            };
            this.game().then();
        });
    }

    async swapTiles(): Promise<void> {
        this.swap = this.swap.filter((tile) => tile.disabled);
        this.swapTile = fromSwap(this.swap, this.gameId);
        this.serviceQwirkle.swapTile(this.swapTile).then((resp) => {
            this.swap = [];
            this.swapTile = [];
            this.game().then();
            this.getPlayerIdToPlay().then();
        });
    }

    async swapTilesRandom(): Promise<void> {
        this.swap = this.rack;
        this.rack = [];

        this.swapTiles().then();
    }

    async skipTurn(): Promise<void> {
        this.serviceQwirkle.skipTurn(this.gameId).then((resp) => {
            this.game().then();
            this.getPlayerIdToPlay().then();
        });
    }

    dropResult(event: CdkDragDrop<Tile[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            this.board = this.board.filter(
                (tile) => tile !== event.previousContainer.data[event.previousIndex]
            );
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            this.plate = toPlate(this.board);
        }
        this.rack = toRarrangeRack(event.container.data);
        this.player.rack.tiles = toTiles(this.rack);

        if (this.rack.length === 6) {
            this.rackTile = fromSwap(
                this.rack.filter((tile) => tile),
                this.gameId
            );
            this.serviceQwirkle.rackChangeOrder(this.rackTile).then(async (rack) => {
                this.player.rack.tiles.sort((a, b) => a.rackPosition - b.rackPosition);
                this.rack = toRarrange(this.player.rack.tiles);
                this.changeDetector.detectChanges();
            });
        }
    }

    gameChange(gameId: number): void {
        if (gameId !== 0) {
            this.gameId = gameId;

            this.serviceQwirkle.getGame(this.gameId).then((board) => {
                this.players = board.players.sort(
                    (a, b) => a.gamePosition - b.gamePosition
                );

                this.serviceQwirkle.getPlayer(gameId).then((result) => {
                    if (result !== null) {
                        this.player = result;
                        this.player.rack.tiles.sort(
                            (a, b) => a.rackPosition - b.rackPosition
                        );

                        this.getPlayerIdToPlay().then();
                        this.nameToTurn = '';

                        this.game().then();
                        console.log(this.player);
                        this.signalRService.hubConnection
                            .start()
                            .then(() => {
                                console.log('Connection started');
                                this.signalRService.sendPlayerInGame(
                                    this.gameId,
                                    this.player.id
                                );
                            })
                            .catch((error) =>
                                console.log('Error while starting connection: ' + error)
                            );

                        this.rack = toRarrange(this.player.rack.tiles);
                        this.router.navigate(['game/' + gameId]).then();
                        this.changeDetector.detectChanges();
                    }
                });
            });
        }
    }

    private Iswinner() {
        this.serviceQwirkle.getWinners(this.gameId).then((response) => {
            this.winner = '';
            if (response.length > 0) {
                this.winner = this.players.find(
                    (player) => player.id === response[0]
                )!.pseudo;
                this.nameToTurn = '';
            }
        });
    }

    getPawStyle(index: number): string {
        return 'translate(' + -index * 65 + 'px,' + index * 15 + 'px)';
    }

    async getPlayerIdToPlay(): Promise<void> {
        this.serviceQwirkle.getPlayerNameTurn(this.gameId).subscribe((response) => {
            this.playerNameToPlay = response;
        });
    }

    ngOnDestroy(): void {
        this.modelChangedSubscription.unsubscribe();
        this.apiSubscription.unsubscribe();
    }

    getCssScale(zoomLevel: any): number {
        return Math.pow(
            this.panzoomConfig.scalePerZoomLevel,
            zoomLevel - this.panzoomConfig.neutralZoomLevel
        );
    }

    Bot() {
        this.serviceQwirkle.getBot(this.gameId).then((result: TilesOnBoard[]) => {
            console.log(result);
            if (result === null) {
                this.swapTilesRandom().then();
            } else {
                const tilesBots: Tile[] = [];
                for (const tile of result) {
                    tilesBots.push({
                        shape: tile.shape,
                        color: tile.color,
                        x: tile.coordinates.x,
                        y: tile.coordinates.y,
                        disabled: true
                    });
                }
                for (const tile of tilesBots) this.dropBot(tile);

                this.Iswinner();
                this.valid().then();
            }
        });
    }

    private newrect(
        ymin: number,
        xmin: number,
        width: number,
        height: number,
        xmax: number,
        ymax: number
    ): Rect {
        let newRect: Rect;
        if (ymin >= 0) {
            newRect =
                xmin <= 0
                    ? this.isInRightBottom(width, height, xmax, xmin, ymax, ymin)
                    : this.isInRightTop(width, height, xmax, xmin, ymax, ymin);
        } else {
            newRect = this.isInLeft(width, height, xmax, xmin, ymax, ymin);
        }
        return newRect;
    }

    private isInLeft(
        width: number,
        height: number,
        xmax: number,
        xmin: number,
        ymax: number,
        ymin: number
    ) {
        return {
            x: width / 2 + 200,
            y: -height,
            width: (width * (Math.abs(xmax - xmin) * 100)) / 1000 + width / 1000,
            height: (height * (Math.abs(ymax - ymin) * 100)) / 600 + height
        };
    }

    private isInRightTop(
        width: number,
        height: number,
        xmax: number,
        xmin: number,
        ymax: number,
        ymin: number
    ) {
        return {
            x: width / 2 + 200,
            y: -height,
            width: (width * (Math.abs(xmax - xmin) * 100)) / 1000 + width / 1000,
            height: (height * (Math.abs(ymax - ymin) * 100)) / 600 + height / 1000
        };
    }

    private isInRightBottom(
        width: number,
        height: number,
        xmax: number,
        xmin: number,
        ymax: number,
        ymin: number
    ) {
        return {
            x: width / 2 + 200,
            y: -height,
            width: (width * (Math.abs(xmax - xmin) * 100)) / 1000,
            height: (height * (Math.abs(ymax - ymin) * 100)) / 600 + height
        };
    }
}
