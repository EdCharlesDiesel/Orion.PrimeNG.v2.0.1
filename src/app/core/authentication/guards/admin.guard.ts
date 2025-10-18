import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkAdmin();
    }

    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkAdmin();
    }

    private checkAdmin(): Observable<boolean | UrlTree> {
        return this.authService.isAuthenticated$.pipe(
            take(1),
            map(isAuthenticated => {
                if (!isAuthenticated) {
                    return this.router.createUrlTree(['/login']);
                }

                const isAdmin = this.authService.hasRole('admin');
                if (!isAdmin) {
                    console.warn('Access denied: Admin role required');
                    return this.router.createUrlTree(['/access-denied']);
                }

                return true;
            }),
            catchError(error => {
                console.error('Admin guard error:', error);
                return of(this.router.createUrlTree(['/access-denied']));
            })
        );
    }
}
