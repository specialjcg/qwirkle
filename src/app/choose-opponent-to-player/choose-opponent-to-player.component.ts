import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import { Router } from '@angular/router';
import { toListGamedId } from '../../domain/games';
import { ListGamedId, Player } from '../../domain/player';

@Component({
    selector: 'app-choose-opponent-to-player',
    templateUrl: './choose-opponent-to-player.component.html',
    styleUrls: ['./choose-opponent-to-player.component.css']
})
export class ChooseOpponentToPlayerComponent implements OnInit {
    // @Input() games: ListGamedId = {} as ListGamedId;
    //
    // @Output() gamesChange = new EventEmitter<ListGamedId>();

    pseudo3 = '';

    pseudo2 = '';

    pseudo1 = '';

    constructor(
        private serviceQwirkle: HttpTileRepositoryService,
        private router: Router
    ) {}

    ngOnInit(): void {}

    NewGame(): void {
        this.serviceQwirkle.newGame([this.pseudo1, this.pseudo2, this.pseudo3]).then();
        // this.serviceQwirkle
        //     .getGames()
        //     .subscribe((games) => (this.games = toListGamedId(games)));
        // this.gamesChange.emit(this.games);
        this.router.navigate(['/game']).then();
    }
}
