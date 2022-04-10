import { Component, OnInit } from '@angular/core';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-choose-opponent-to-player',
    templateUrl: './choose-opponent-to-player.component.html',
    styleUrls: ['./choose-opponent-to-player.component.css']
})
export class ChooseOpponentToPlayerComponent implements OnInit {
    pseudo3 = '';

    pseudo2 = '';

    pseudo1 = '';

    favories: string[] = [];

    myControl = new FormControl();

    filteredOptions: Observable<string[]> | undefined;

    constructor(
        private serviceQwirkle: HttpTileRepositoryService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map((value: any) => this._filter(value))
        );
        this.serviceQwirkle.listFavoriteGamer().subscribe((data) => this.favories=data);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.favories.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    NewGame(): void {
        this.serviceQwirkle
            .newGame([this.pseudo1, this.pseudo2, this.pseudo3])
            .then((gameId) => this.router.navigate(['/game/' + gameId]).then());
    }

    bot(pseudo: string) {
        if (pseudo === 'pseudo1') this.pseudo1 = 'bot1';
        if (pseudo === 'pseudo2') this.pseudo2 = 'bot2';
        if (pseudo === 'pseudo3') this.pseudo3 = 'bot3';
    }

    addFavorite(pseudo: string) {
        this.serviceQwirkle.addFavoriteGamer(pseudo).subscribe();
    }
}
