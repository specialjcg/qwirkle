import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Login } from '../../../domain/Tile';
import HttpTileRepositoryService from '../../../infra/httpRequest/http-tile-repository.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
    @Output() userChange = new EventEmitter<number>();

    login: Login = { userName: '', password: '', RememberMe: false };

    badLogin = false;

    constructor(public service: HttpTileRepositoryService, private router: Router) {}

    ngOnInit(): void {
        this.login = { userName: '', password: '', RememberMe: false };
    }

    getLogin() {
        console.log(this.login);
        this.service.LoginUser(this.login).subscribe(
            (response) => {
                if (response) {
                    this.router.navigate(['/game']).then();
                } else {
                    this.badLogin = true;

                    this.router.navigate(['/']).then();
                }
            },
            () => {
                this.service.LogoutUser().then(() => {
                    this.badLogin = true;

                    this.router.navigate(['/login']).then();
                });
            }
        );
    }

    changeUserName(ValueUserName: HTMLInputElement) {
        this.badLogin = false;
        this.login.userName = ValueUserName.value;
    }

    changePassword(ValuePassword: HTMLInputElement) {
        this.badLogin = false;
        this.login.password = ValuePassword.value;
    }

    getGuess() {
        this.service.LogGuest().subscribe(() => this.router.navigate(['/game']).then());
    }

    isremenber() {
        this.login.RememberMe = !this.login.RememberMe;
    }
}
