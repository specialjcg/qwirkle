import { Component, EventEmitter, Input, Output } from '@angular/core';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import { ListGamedId, Player } from '../../domain/player';
import { toListGamedId } from '../../domain/games';

@Component({
    selector: 'app-choose-game',
    templateUrl: './choose-game.component.html',
    styleUrls: ['./choose-game.component.css']
})
export class ChooseGameComponent {
    @Output() gameSelectChange = new EventEmitter<number>();

    @Input() games: ListGamedId = { listGameId: [] };

    @Input() gameId = 0;

    constructor(public service: HttpTileRepositoryService) {}

    async ngOnInit(): Promise<void> {
        this.service.getGames().subscribe((games) => (this.games = toListGamedId(games)));
    }

    async gameChoice(gameId: number): Promise<void> {
        console.log('game selected : ' + gameId);
        this.gameSelectChange.emit(gameId);
    }
}
