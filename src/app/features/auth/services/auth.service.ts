import { AuthResponse } from '@/core/models/auth.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { UserAuthData } from '../models/user-auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageKey = 'token';

  private httpClient = inject(HttpClient);

  get userToken(): string | null {
    return localStorage.getItem(this.localStorageKey) ?? null;
  }

  public signup({
    email,
    password,
  }: UserAuthData): Observable<{ apiError: boolean } | null> {
    return this.httpClient
      .post<AuthResponse>('/api/signup', {
        email,
        password,
      })
      .pipe(
        map(() => null),
        catchError((err: HttpErrorResponse) => {
          if (err.status === HttpStatusCode.BadRequest) {
            return of({ apiError: true });
          }

          return of(null);
        }),
      );
  }

  public signin({
    email,
    password,
  }: UserAuthData): Observable<{ apiError: boolean } | null> {
    return this.httpClient
      .post<AuthResponse>('/api/signin', {
        email,
        password,
      })
      .pipe(
        map(({ token }) => {
          this.setUserToken(token);
          return null;
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === HttpStatusCode.BadRequest) {
            return of({ apiError: true });
          }

          return of(null);
        }),
      );
  }

  private setUserToken(token: string): void {
    localStorage.setItem(this.localStorageKey, token);
  }
}
