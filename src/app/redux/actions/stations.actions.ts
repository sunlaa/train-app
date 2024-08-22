import { TStationCreation, TStationListed } from '@/core/models/stations.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

// Load stations

export const loadStations = createAction('[Stations Management] Load stations');

export const loadStationsSuccess = createAction(
  '[Stations API] Load stations success',
  props<{ stations: TStationListed[] }>(),
);

export const loadStationsError = createAction(
  '[Stations API] Load stations error',
  props<{ error: HttpErrorResponse }>(),
);

// Create station

export const createStation = createAction(
  '[Stations Management] Create station',
  props<{ station: TStationCreation }>(),
);

export const createStationSuccess = createAction(
  '[Stations API] Create station success',
  props<{ stations: TStationListed[] }>(),
);

export const createStationError = createAction(
  '[Stations API] Create station error',
  props<{ error: HttpErrorResponse }>(),
);

// Delete station

export const deleteStation = createAction(
  '[Stations Management] Delete station',
  props<{ id: number }>(),
);

export const deleteStationSuccess = createAction(
  '[Stations API] Delete station success',
  props<{ id: number }>(),
);

export const deleteStationError = createAction(
  '[Stations API] Delete station error',
  props<{ error: HttpErrorResponse }>(),
);
