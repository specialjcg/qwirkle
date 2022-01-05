import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-choose-opponent-to-player',
    templateUrl: './choose-opponent-to-player.component.html',
    styleUrls: ['./choose-opponent-to-player.component.css']
})
export class ChooseOpponentToPlayerComponent implements OnInit {


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

        this.router.navigate(['/game']).then();
    }
}
