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
      ofType(carriagesActions.loadCarriages),
      switchMap(() =>
        this.carriageService.getCarriages().pipe(
          map((carriages) =>
            carriagesActions.loadCarriagesSuccess({ carriages }),
          ),
          catchError((error) =>
            of(carriagesActions.loadCarriagesError({ error })),
          ),
        ),
      ),
    );
  });

  createCarriage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(carriagesActions.createCarriage),
      switchMap(({ carriage }) =>
        this.carriageService.createCarriage(carriage).pipe(
          map((carriageCode) =>
            carriagesActions.createCarriageSuccess({
              carriage: { ...carriage, ...carriageCode },
            }),
          ),
          catchError((error) =>
            of(carriagesActions.createCarriageError({ error })),
          ),
        ),
      ),
    );
  });

  updateCarriage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(carriagesActions.updateCarriage),
      switchMap(({ carriage }) =>
        this.carriageService.updateCarriage(carriage).pipe(
          map((carriageCode) =>
            carriagesActions.updateCarriageSuccess({
              carriage: { ...carriage, ...carriageCode },
            }),
          ),
          catchError((error) =>
            of(carriagesActions.updateCarriageError({ error })),
          ),
        ),
      ),
    );
  });

  deleteCarriage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(carriagesActions.deleteCarriage),
      switchMap(({ code }) =>
        this.carriageService.deleteCarriage(code).pipe(
          map(() => carriagesActions.deleteCarriageSuccess({ code })),
          catchError((error) =>
            of(carriagesActions.deleteCarriageError({ error })),
          ),
        ),
      ),
    );
  });
}
