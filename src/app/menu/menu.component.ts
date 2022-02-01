import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import { Router } from '@angular/router';
import { ListGamedId } from '../../domain/player';
import { toListGamedId } from '../../domain/games';
import { HttpInstantGameService } from '../../infra/httpRequest/http-instant-game.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    @Input() boardLength = 0;

    games: ListGamedId = { listGameId: [] };

    @Input() gameId = 0;

    @Output() gameIdChanged = new EventEmitter<number>();

    constructor(
        private instantGameService: HttpInstantGameService,
        private serviceQwirkle: HttpTileRepositoryService,
        private router: Router
    ) {
        this.serviceQwirkle
            .getGames()
            .subscribe((games) => (this.games = toListGamedId(games)));
    }

    ngOnInit(): void {}

    async logOut() {
        this.serviceQwirkle
            .LogoutUser()
            .then(() => this.router.navigate(['/login']).then());
    }

    gameChange($event: number) {
        this.gameIdChanged.emit($event);
    }

    instantGameTwoPlayer() {
        this.instantGameService.instantGame(2).subscribe((result) => {
            if (result.startsWith('waiting for ')) {
                console.log('toto');
            } else {
                this.router.navigate(['/game/' + JSON.parse(result)[0].gameId]).then();
            }
        });
    }
}
