import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.isAuthenticated$.pipe(
            take(1),
            map(isAuthenticated => {
                if (isAuthenticated) {
                    // Redirect authenticated users to dashboard
                    return this.router.createUrlTree(['/dashboard']);
                }
                return true;
            }),
            catchError(error => {
                console.error('NoAuth guard error:', error);
                return of(true); // Allow access on error
            })
        );
    }
}
