import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { backurl } from '../http-tile-repository.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {}

    isAuthenticated() {
        return this.http.get(backurl + '/User/WhoAmI/');
    }
}
