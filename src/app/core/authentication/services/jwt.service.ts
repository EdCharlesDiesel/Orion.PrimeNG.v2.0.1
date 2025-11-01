import { Injectable } from '@angular/core';

interface JwtPayload {
    sub?: string; // Subject (user ID)
    email?: string;
    username?: string;
    roles?: string[];
    exp?: number; // Expiration time (seconds since epoch)
    iat?: number; // Issued at (seconds since epoch)
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class JwtService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';

    constructor() {}

    /**
     * Store JWT token in localStorage
     */
    saveToken(token: string): void {
        if (token) {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    /**
     * Get stored JWT token
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Remove JWT token from storage
     */
    destroyToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    /**
     * Store refresh token in localStorage
     */
    saveRefreshToken(token: string): void {
        if (token) {
            localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
        }
    }

    /**
     * Get stored refresh token
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Remove refresh token from storage
     */
    destroyRefreshToken(): void {
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Decode JWT token and return payload
     */
    decodeToken(token?: string): JwtPayload | null {
        const jwtToken = token || this.getToken();

        if (!jwtToken) {
            return null;
        }

        try {
            const parts = jwtToken.split('.');
            if (parts.length !== 3) {
                console.error('Invalid JWT token format');
                return null;
            }

            const payload = parts[1];

            return JSON.parse(this.base64UrlDecode(payload));
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    }

    /**
     * Check if token is expired
     */
    isTokenExpired(token?: string): boolean {
        const jwtToken = token || this.getToken();

        if (!jwtToken) {
            return true;
        }

        const decoded = this.decodeToken(jwtToken);
        if (!decoded || !decoded.exp) {
            return true;
        }

        const expirationDate = new Date(decoded.exp * 1000);
        return expirationDate <= new Date();
    }

    /**
     * Get token expiration date
     */
    getTokenExpirationDate(token?: string): Date | null {
        const decoded = this.decodeToken(token);

        if (!decoded || !decoded.exp) {
            return null;
        }

        return new Date(decoded.exp * 1000);
    }

    /**
     * Get time until token expires (in milliseconds)
     */
    getTimeUntilExpiration(token?: string): number {
        const expirationDate = this.getTokenExpirationDate(token);

        if (!expirationDate) {
            return 0;
        }

        return expirationDate.getTime() - Date.now();
    }

    /**
     * Check if token is valid (exists and not expired)
     */
    isTokenValid(token?: string): boolean {
        const jwtToken = token || this.getToken();
        return !!jwtToken && !this.isTokenExpired(jwtToken);
    }

    /**
     * Get user ID from token
     */
    getUserId(token?: string): string | null {
        const decoded = this.decodeToken(token);
        return decoded?.sub || decoded?.['id'] || null;
    }

    /**
     * Get user email from token
     */
    getUserEmail(token?: string): string | null {
        const decoded = this.decodeToken(token);
        return decoded?.email || null;
    }

    /**
     * Get user roles from token
     */
    getUserRoles(token?: string): string[] {
        const decoded = this.decodeToken(token);
        return decoded?.roles || [];
    }

    /**
     * Get username from token
     */
    getUsername(token?: string): string | null {
        const decoded = this.decodeToken(token);
        return decoded?.username || decoded?.['name'] || null;
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: string, token?: string): boolean {
        const roles = this.getUserRoles(token);
        return roles.includes(role);
    }

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(requiredRoles: string[], token?: string): boolean {
        const userRoles = this.getUserRoles(token);
        return requiredRoles.some((role) => userRoles.includes(role));
    }

    /**
     * Check if user has all of the specified roles
     */
    hasAllRoles(requiredRoles: string[], token?: string): boolean {
        const userRoles = this.getUserRoles(token);
        return requiredRoles.every((role) => userRoles.includes(role));
    }

    /**
     * Get all token data
     */
    getTokenData(token?: string): JwtPayload | null {
        return this.decodeToken(token);
    }

    /**
     * Clear all tokens
     */
    clearTokens(): void {
        this.destroyToken();
        this.destroyRefreshToken();
    }

    /**
     * Base64 URL decode helper
     */
    private base64UrlDecode(str: string): string {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');

        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw new Error('Invalid base64url string');
        }

        try {
            return decodeURIComponent(
                atob(output)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
        } catch (error) {
            return atob(output);
        }
    }

    /**
     * Check if token will expire soon (within specified minutes)
     */
    willExpireSoon(minutes: number = 5, token?: string): boolean {
        const timeUntilExpiration = this.getTimeUntilExpiration(token);
        const millisecondsThreshold = minutes * 60 * 1000;
        return timeUntilExpiration > 0 && timeUntilExpiration <= millisecondsThreshold;
    }

    /**
     * Get token age (how long ago it was issued) in milliseconds
     */
    getTokenAge(token?: string): number {
        const decoded = this.decodeToken(token);

        if (!decoded || !decoded.iat) {
            return 0;
        }

        const issuedDate = new Date(decoded.iat * 1000);
        return Date.now() - issuedDate.getTime();
    }

    /**
     * Format time until expiration as human-readable string
     */
    getExpirationTimeFormatted(token?: string): string {
        const timeMs = this.getTimeUntilExpiration(token);

        if (timeMs <= 0) {
            return 'Expired';
        }

        const hours = Math.floor(timeMs / (1000 * 60 * 60));
        const minutes = Math.floor((timeMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeMs % (1000 * 60)) / 1000);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }
}
