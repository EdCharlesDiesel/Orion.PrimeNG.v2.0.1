import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthResponse } from '../../models/auth-response.model';
import { environment } from '../../../../environments/environment';

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

interface User {
    id: string;
    email: string;
    username: string;
    roles: string[];
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly USER_KEY = 'current_user';
    private readonly API_URL = environment.userProfileUrl;

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
    private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    public currentUser$ = this.currentUserSubject.asObservable();

    public redirectUrl: string | null = null;
    token: any;

    private loggedInFake = signal<boolean>(false);
    isLoggedInFake = this.loggedInFake.asReadonly();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        const stored = localStorage.getItem('isLoggedIn');
        if (stored === 'true') {
            this.loggedInFake.set(true);
        }
    }

    /**
     * Login user with credentials
     */
    public login(loginData: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, loginData).pipe(
            tap((response) => this.handleAuthSuccess(response)),
            catchError((error) => {
                console.error('Login failed:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Register new user
     */
    register(registerData: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/register`, registerData).pipe(
            tap((response) => this.handleAuthSuccess(response)),
            catchError((error) => {
                console.error('Registration failed:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Logout user and clear stored data
     */
    logout(): void {
        this.clearAuthData();
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    /**
     * Request password reset
     */
    requestPasswordReset(email: string): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/password-reset/request`, { email }).pipe(
            catchError((error) => {
                console.error('Password reset request failed:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Change user password
     */
    changePassword(currentPassword: string, newPassword: string): Observable<void> {
        return this.http
            .post<void>(`${this.API_URL}/password/change`, {
                currentPassword,
                newPassword
            })
            .pipe(
                catchError((error) => {
                    console.error('Password change failed:', error);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Get current authenticated user
     */
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    /**
     * Get stored authentication token
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user?.roles?.includes(role) ?? false;
    }

    /**
     * Check if user has any of the required roles
     */
    hasAnyRole(requiredRoles: string[]): boolean {
        const user = this.getCurrentUser();
        if (!user?.roles) return false;
        return requiredRoles.some((role) => user.roles.includes(role));
    }

    /**
     * Get and clear redirect URL
     */
    getAndClearRedirectUrl(): string | null {
        const url = this.redirectUrl;
        this.redirectUrl = null;
        return url;
    }

    /**
     * Update user profile
     */
    updateProfile(userData: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.API_URL}/profile`, userData).pipe(
            tap((updatedUser) => {
                this.storeUser(updatedUser);
                this.currentUserSubject.next(updatedUser);
            }),
            catchError((error) => {
                console.error('Profile update failed:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Handle successful authentication
     */
    private handleAuthSuccess(response: AuthResponse): void {
        this.storeToken(response.token);

        if (response.refreshToken) {
            this.storeRefreshToken(response.refreshToken);
        }

        this.storeUser(response.user);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);

        // Handle redirect after successful authentication
        const redirectPath = this.getAndClearRedirectUrl() || '/dashboard';
        this.router.navigate([redirectPath]);
    }

    /**
     * Store authentication token
     */
    private storeToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    /**
     * Store refresh token
     */
    private storeRefreshToken(refreshToken: boolean): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, String(refreshToken));
    }

    /**
     * Store user data
     */
    private storeUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    /**
     * Get stored user from localStorage
     */
    private getStoredUser(): User | null {
        const userJson = localStorage.getItem(this.USER_KEY);
        if (userJson) {
            try {
                return JSON.parse(userJson);
            } catch (e) {
                console.error('Failed to parse stored user:', e);
                return null;
            }
        }
        return null;
    }

    /**
     * Check if valid token exists
     */
    private hasValidToken(): boolean {
        const token = this.getToken();
        if (!token) return false;

        // Optional: Add JWT expiration check here
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000;
            return Date.now() < expiry;
        } catch (e) {
            return false;
        }
    }

    /**
     * Clear all authentication data
     */
    private clearAuthData(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }


}
