import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
export const backurl = environment.backend.baseURL;
const headers = new HttpHeaders()
    .set('Access-Control-Allow-Origin', '*')
    .set('Content-Type', 'application/json; charset=utf-8');

const httpNameTurnoptions = {
    headers: headers,
    withCredentials: true,
    responseType: 'text' as 'json'
};
@Injectable({
    providedIn: 'root'
})
export class HttpInstantGameService {
    constructor(private https: HttpClient) {}

    instantGame(playersNumber: number): Observable<string> {
        return this.https.get<string>(backurl + '/InstantGame/Join/' + playersNumber, httpNameTurnoptions);
    }
}
