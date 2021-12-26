import { Component, OnInit } from '@angular/core';
import HttpTileRepositoryService from '../../../infra/httpRequest/http-tile-repository.service';
import { Router } from '@angular/router';
import { Register } from '../../../domain/register';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    register: Register = {
        pseudo: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        isRemember: true
    };

    constructor(public service: HttpTileRepositoryService, private router: Router) {}

    ngOnInit() {
        this.register = {
            pseudo: '',
            firstName: 'jean',
            lastName: 'c',
            email: '',
            password: '',
            isRemember: true
        };
    }

    getregister() {
        this.service
            .setRegister(this.register)
            .subscribe(() => this.router.navigate(['/login']));
    }

    changeUserName(ValueUserName: HTMLInputElement) {
        this.register.pseudo = ValueUserName.value;
    }

    changeEmail(ValueEmail: HTMLInputElement) {
        this.register.email = ValueEmail.value;
    }

    changePassword(Valuepassword: HTMLInputElement) {
        this.register.password = Valuepassword.value;
    }
}
