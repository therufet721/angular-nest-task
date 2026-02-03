import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly API_URL = environment.apiUrl;

  private userSignal = signal<User | null>(null);
  private loadingSignal = signal<boolean>(false);

  user = computed(() => this.userSignal());
  isAuthenticated = computed(() => !!this.getToken());
  isLoading = computed(() => this.loadingSignal());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(data: RegisterRequest): Observable<RegisterResponse> {
    this.loadingSignal.set(true);
    return this.http.post<RegisterResponse>(`${this.API_URL}/auth/register`, data).pipe(
      tap(() => this.loadingSignal.set(false)),
      catchError(error => {
        this.loadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    this.loadingSignal.set(true);
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, data).pipe(
      tap(response => {
        this.setToken(response.access_token);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  validate(): Observable<User> {
    this.loadingSignal.set(true);
    return this.http.get<User>(`${this.API_URL}/auth/validate`).pipe(
      tap(user => {
        this.userSignal.set(user);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.userSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
