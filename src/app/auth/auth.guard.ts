import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../infra/httpRequest/services/auth.service';
import { catchError, map } from 'rxjs/operators';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        public service: HttpTileRepositoryService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.authService.isAuthenticated().pipe(
            map((authenticated) => {
                console.log(authenticated);
                this.service.whoAmI().subscribe((resa) => {
                    return authenticated === resa;
                });
                this.router.navigate(['/login']).then();
                return false;
            }),
            catchError((error) => {
                this.router.navigate(['/login']).then();
                return of(false);
            })
        );
    }
}
