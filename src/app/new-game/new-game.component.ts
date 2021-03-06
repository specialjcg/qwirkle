import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { ListGamedId } from '../../domain/player';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import {toListGamedId} from "../../domain/games";

@Component({
    selector: 'app-new-game',
    templateUrl: './new-game.component.html',
    styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {
    @Input() game = 0;

    @Output() gameChange = new EventEmitter<number>();

    games: ListGamedId = { listGameId: [] };

    constructor(public service: HttpTileRepositoryService) {}

    async ngOnInit(): Promise<void> {
        this.service.getGames().subscribe((games) => (this.games = toListGamedId(games)));
    }

    newGame(): void {
        this.gameChange.emit(this.game);
    }
}
