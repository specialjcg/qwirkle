import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(

        private router: Router,
        public service: HttpTileRepositoryService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.service.getGames().pipe(
            map((authenticated) => {
                console.log(authenticated);

                return true;
            }),
            catchError((error) => {
                this.router.navigate(['/login']).then();
                return of(false);
            })
        );
    }
}
