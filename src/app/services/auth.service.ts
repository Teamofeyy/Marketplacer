import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {catchError, tap} from 'rxjs';

export interface TokenResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)
  router = inject(Router);
  cookieService = inject(CookieService);

  baseApiUrl = 'http://45.155.207.232:9667/auth'
  token: string | null = null

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = this.cookieService.get('token');
    }
    return this.token;
  }

  register(payload: { login: string, password: string, role_id: number }) {
    return this.http.post<TokenResponse>(`${this.baseApiUrl}/register`, payload, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        // TODO Удалить логи перед продом(опционально можно запилить глобальный логер который работает только в dev сборке)
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  login(payload: { login: string, password: string }) {
    return this.http.post<TokenResponse>(`${this.baseApiUrl}/login`, payload, {
      headers: this.getHeaders()
    }).pipe(
      tap(res => {
        this.saveTokens(res);
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  logout() {
    this.cookieService.deleteAll()
    this.token = null
    this.router.navigate(['/auth/login']).then()
  }

  saveTokens(res: TokenResponse) {
    this.token = res.access_token
    this.cookieService.set('token', this.token)
  }

  constructor() { }
}
