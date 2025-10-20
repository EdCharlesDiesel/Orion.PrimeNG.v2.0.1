import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkRole(route);
    }

    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkRole(childRoute);
    }

    private checkRole(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this.authService.isAuthenticated$.pipe(
            take(1),
            map(isAuthenticated => {
                if (!isAuthenticated) {
                    return this.router.createUrlTree(['/login']);
                }

                const requiredRoles = route.data?.['roles'] as string[] | string;
                if (!requiredRoles) {
                    return true; // No role requirement
                }

                const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
                const hasRole = this.authService.hasAnyRole(roles);

                if (!hasRole) {
                    console.warn(`Access denied. Required roles: ${roles.join(', ')}`);
                    return this.router.createUrlTree(['/access-denied']);
                }

                return true;
            }),
            catchError(error => {
                console.error('Role guard error:', error);
                return of(this.router.createUrlTree(['/access-denied']));
            })
        );
    }
}
