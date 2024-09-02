import { concatLatestFrom } from '@ngrx/operators';
import { ProfileService } from '@/features/profile/services/profile.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import UserStorage from '@/features/auth/utils/userStorage';
import { Store } from '@ngrx/store';
import { profileActions } from '../actions';
import { profileFeature } from '../reducers';

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private profileService: ProfileService,
    private store: Store,
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
      switchMap(({ password }) => {
        return this.profileService.updatePassword(password).pipe(
          map(() => profileActions.updatePasswordSuccess()),
          catchError((error: HttpErrorResponse) =>
            of(profileActions.updatePasswordError({ error })),
          ),
        );
      }),
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

  updateStorage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          profileActions.loadProfileSuccess,
          profileActions.updateProfileSuccess,
          profileActions.logoutSuccess,
        ),
        concatLatestFrom(() => this.store.select(profileFeature.selectProfile)),
        switchMap(([, profile]) => of(UserStorage.setUser(profile))),
      );
    },
    { dispatch: false },
  );
}
