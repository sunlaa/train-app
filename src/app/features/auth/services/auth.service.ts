import { AuthResponse } from '@/core/models/auth.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Role, UserAuthData } from '../models/user-auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenStorageKey = 'token';

  private roleStorageKey = 'role';

  private httpClient = inject(HttpClient);

  get userToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey) ?? null;
  }

  get userRole(): Role {
    return (localStorage.getItem(this.roleStorageKey) as Role) ?? 'guest';
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
          const role = email === 'admin@admin.com' ? 'admin' : 'user';
          this.setCredentials(token, role);
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

  public logout() {
    localStorage.clear();
  }

  private setCredentials(token: string, role: Role): void {
    localStorage.setItem(this.tokenStorageKey, token);
    localStorage.setItem(this.roleStorageKey, role);
  }
  
  public removeUserToken(): void {
    localStorage.removeItem(this.localStorageKey);
  }
}
