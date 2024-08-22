import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { CarriagesService } from '@/features/carriages-management/services/carriages.service';
import { carriagesActions } from '../actions';

@Injectable()
export class CarriagesEffects {
  constructor(
    private actions$: Actions,
    private carriageService: CarriagesService,
  ) {}

  loadCarriages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(carriagesActions.load),
      switchMap(() =>
        this.carriageService.getCarriages().pipe(
          map((carriages) => carriagesActions.loadSuccess({ carriages })),
          catchError((error) => of(carriagesActions.loadError({ error }))),
        ),
      ),
    );
  });

  createCarriage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(carriagesActions.create),
      switchMap(({ carriage }) =>
        this.carriageService.createCarriage(carriage).pipe(
          map((carriageCode) =>
            carriagesActions.createSuccess({
              carriage: { ...carriage, ...carriageCode },
            }),
          ),
          catchError((error) => of(carriagesActions.createError({ error }))),
        ),
      ),
    );
  });

  updateCarriage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(carriagesActions.update),
      switchMap(({ carriage }) =>
        this.carriageService.updateCarriage(carriage).pipe(
          map((carriageCode) =>
            carriagesActions.updateSuccess({
              carriage: { ...carriage, ...carriageCode },
            }),
          ),
          catchError((error) => of(carriagesActions.updateError({ error }))),
        ),
      ),
    );
  });

  deleteCarriage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(carriagesActions.delete),
      switchMap(({ code }) =>
        this.carriageService.deleteCarriage(code).pipe(
          map(() => carriagesActions.deleteSuccess({ code })),
          catchError((error) => of(carriagesActions.deleteError({ error }))),
        ),
      ),
    );
  });
}
