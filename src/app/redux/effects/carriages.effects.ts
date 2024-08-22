import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { CarriagesService } from '@/features/carriages-management/services/carriages.service';
import {
  createCarriage,
  createCarriageError,
  createCarriageSuccess,
  deleteCarriage,
  deleteCarriageError,
  deleteCarriageSuccess,
  loadCarriages,
  loadCarriagesError,
  loadCarriagesSuccess,
  updateCarriage,
  updateCarriageError,
  updateCarriageSuccess,
} from '../actions/carriages.actions';

@Injectable()
export class CarriagesEffects {
  constructor(
    private actions$: Actions,
    private carriageService: CarriagesService,
  ) {}

  loadCarriages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCarriages),
      switchMap(() =>
        this.carriageService.getCarriages().pipe(
          map((carriages) => loadCarriagesSuccess({ carriages })),
          catchError((error) => of(loadCarriagesError({ error }))),
        ),
      ),
    );
  });

  createCarriage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createCarriage),
      switchMap(({ carriage }) =>
        this.carriageService.createCarriage(carriage).pipe(
          map((carriageCode) =>
            createCarriageSuccess({
              carriage: { ...carriage, ...carriageCode },
            }),
          ),
          catchError((error) => of(createCarriageError({ error }))),
        ),
      ),
    );
  });

  updateCarriage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateCarriage),
      switchMap(({ carriage }) =>
        this.carriageService.updateCarriage(carriage).pipe(
          map((carriageCode) =>
            updateCarriageSuccess({
              carriage: { ...carriage, ...carriageCode },
            }),
          ),
          catchError((error) => of(updateCarriageError({ error }))),
        ),
      ),
    );
  });

  deleteCarriage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteCarriage),
      switchMap(({ code }) =>
        this.carriageService.deleteCarriage(code).pipe(
          map(() => deleteCarriageSuccess({ code })),
          catchError((error) => of(deleteCarriageError({ error }))),
        ),
      ),
    );
  });
}
