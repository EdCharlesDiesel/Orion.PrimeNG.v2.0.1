import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class OwnershipGuard implements CanActivate {

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
                if (!isAuthenticated) {
                    return this.router.createUrlTree(['/login']);
                }

                const currentUser = this.authService.getCurrentUser();
                const resourceUserId = route.params['userId'] || route.data?.['userId'];

                // Allow if user is admin
                if (this.authService.hasRole('admin')) {
                    return true;
                }

                // Check if user owns the resource
                if (currentUser?.id !== resourceUserId) {
                    console.warn('Access denied: User does not own this resource');
                    return this.router.createUrlTree(['/access-denied']);
                }

                return true;
            }),
            catchError(error => {
                console.error('Ownership guard error:', error);
                return of(this.router.createUrlTree(['/access-denied']));
            })
        );
    }
}
