import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}`;
    private tokenKey = 'auth_token';
    private userSubject = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient) {
        this.loadToken();
    }

    private loadToken() {
        const token = localStorage.getItem(this.tokenKey);
        if (token) {
            // Potentially validate token or set user state
            // For now, assume logged in if token exists
            this.userSubject.next({ token });
        }
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((response: any) => {
                if (response.token) {
                    this.setToken(response.token);
                    this.userSubject.next(response.user);
                }
            })
        );
    }

    register(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, data);
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        this.userSubject.next(null);
        // Optionally call logout endpoint
    }

    private setToken(token: string) {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getUser(): Observable<any> {
        return this.userSubject.asObservable();
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
