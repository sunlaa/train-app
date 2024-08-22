import { TCarriage } from '@/core/models/carriages.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

// Load carriages

export const loadCarriages = createAction(
  '[Carriages Management] Load carriages',
);

export const loadCarriagesSuccess = createAction(
  '[Carriages API] Load carriages success',
  props<{ carriages: TCarriage[] }>(),
);

export const loadCarriagesError = createAction(
  '[Carriages API] Load carriages error',
  props<{ error: HttpErrorResponse }>(),
);

// Create carriage

export const createCarriage = createAction(
  '[Carriages Management] Create carriage',
  props<{ carriage: Omit<TCarriage, 'code'> }>(),
);

export const createCarriageSuccess = createAction(
  '[Carriages API] Create carriage success',
  props<{ carriage: TCarriage }>(),
);

export const createCarriageError = createAction(
  '[Carriages API] Create carriage error',
  props<{ error: HttpErrorResponse }>(),
);

// Update carriage

export const updateCarriage = createAction(
  '[Carriages Management] Update carriage',
  props<{ carriage: TCarriage }>(),
);

export const updateCarriageSuccess = createAction(
  '[Carriages API] Update carriage success',
  props<{ carriage: TCarriage }>(),
);

export const updateCarriageError = createAction(
  '[Carriages API] Update carriage error',
  props<{ error: HttpErrorResponse }>(),
);

// Delete carriage

export const deleteCarriage = createAction(
  '[Carriages Management] Delete carriage',
  props<{ code: string }>(),
);

export const deleteCarriageSuccess = createAction(
  '[Carriages API] Delete carriage success',
  props<{ code: string }>(),
);

export const deleteCarriageError = createAction(
  '[Carriages API] Delete carriage error',
  props<{ error: HttpErrorResponse }>(),
);
