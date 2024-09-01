import { ProfileService } from '@/features/profile/services/profile.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { profileActions } from '../actions';

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private profileService: ProfileService,
  ) {}

  loadProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.loadProfile),
      switchMap(() => this.profileService.loadProfile()),
      map((profile) => profileActions.loadProfileSuccess({ profile })),
      catchError((error: HttpErrorResponse) =>
        of(profileActions.loadProfileError({ error })),
      ),
    );
  });

  updateProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.updateProfile),
      switchMap(({ profile }) => this.profileService.updateProfile(profile)),
      map((profile) => profileActions.updateProfileSuccess({ profile })),
      catchError((error: HttpErrorResponse) =>
        of(profileActions.updateProfileError({ error })),
      ),
    );
  });

  updatePassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.updatePassword),
      tap(() => {
        console.log('unside');
      }),
      switchMap(({ password }) => this.profileService.updatePassword(password)),
      map(() => profileActions.updatePasswordSuccess()),
      catchError((error: HttpErrorResponse) =>
        of(profileActions.updatePasswordError({ error })),
      ),
    );
  });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.logout),
      switchMap(() => this.profileService.logout()),
      map(() => profileActions.logoutSuccess()),
      catchError((error: HttpErrorResponse) =>
        of(profileActions.logoutError({ error })),
      ),
    );
  });
}
