import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Login } from '../../../domain/Tile';
import HttpTileRepositoryService from '../../../infra/httpRequest/http-tile-repository.service';
import { ListUsersId } from '../../../domain/player';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
    @Input() userId = 0;

    @Output() userChange = new EventEmitter<number>();

    @Input() users: ListUsersId = { listUsersId: [] };

    login: Login = { pseudo: '', password: '', isRemember: true };

    constructor(public service: HttpTileRepositoryService) {}

    ngOnInit(): void {}

    getLogin() {
        // await this.service.LogoutUser();
        console.log(this.login);
        this.service.LoginUser(this.login).subscribe((res) => {
            console.log(res);
            this.service.whoAmI().subscribe((resa) => {
                this.userId = resa;
                this.service.getUsers().then((res1) => (this.users = res1));
            });
        });
    }

    changeUserName(ValueUserName: HTMLInputElement) {
        this.login.pseudo = ValueUserName.value;
    }

    changePassword(ValuePassword: HTMLInputElement) {
        this.login.password = ValuePassword.value;
    }
}
