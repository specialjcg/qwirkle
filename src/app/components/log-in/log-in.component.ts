import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Login } from '../../../domain/Tile';
import HttpTileRepositoryService from '../../../infra/httpRequest/http-tile-repository.service';
import { ListUsersId } from '../../../domain/player';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
    @Output() userChange = new EventEmitter<number>();

    login: Login = { pseudo: '', password: '', isRemember: true };

    constructor(public service: HttpTileRepositoryService, private router: Router) {}

    ngOnInit(): void {
        this.login = { pseudo: '', password: '', isRemember: true };
    }

    getLogin() {
        this.service.LoginUser(this.login).subscribe(
            (response) => {
                console.log(response);
                if (response) {
                    this.router.navigate(['/game']).then();
                } else {
                    this.router.navigate(['/']).then();
                }
            },
            (error) => {
                console.log(error);
                this.service
                    .LogoutUser()
                    .subscribe(() => this.router.navigate(['/']).then());
            }
        );
    }

    changeUserName(ValueUserName: HTMLInputElement) {
        this.login.pseudo = ValueUserName.value;
    }

    changePassword(ValuePassword: HTMLInputElement) {
        this.login.password = ValuePassword.value;
    }
}
