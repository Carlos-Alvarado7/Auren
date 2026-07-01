import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { API_BASE_URL } from './api.tokens';
import { AuthenticatedAdmin } from './menu.models';

interface AuthResponse {
  admin: AuthenticatedAdmin;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly adminSubject = new BehaviorSubject<AuthenticatedAdmin | null>(null);
  readonly admin$ = this.adminSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<AuthenticatedAdmin> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password }).pipe(
      map((response) => response.admin),
      tap((admin) => this.adminSubject.next(admin))
    );
  }

  loadSession(): Observable<AuthenticatedAdmin | null> {
    return this.http.get<AuthResponse>(`${API_BASE_URL}/auth/me`).pipe(
      map((response) => response.admin),
      tap((admin) => this.adminSubject.next(admin)),
      catchError(() => {
        this.adminSubject.next(null);
        return of(null);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/auth/logout`, {}).pipe(tap(() => this.adminSubject.next(null)));
  }
}

