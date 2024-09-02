import { AuthResponse } from '@/core/models/auth.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ProfileFacadeService } from '@/features/profile/services/profile-facade.service';
import { UserAuthData } from '../models/user-auth-data.model';
import UserStorage from '../utils/userStorage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  private profileFacade = inject(ProfileFacadeService);

  get userToken(): string | null {
    return UserStorage.getAuthToken();
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
          UserStorage.setAuthToken(token);
          this.profileFacade.loadProfile();
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
    UserStorage.clear();
  }
}
