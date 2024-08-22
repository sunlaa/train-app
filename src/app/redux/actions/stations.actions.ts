import { TStationCreation, TStationListed } from '@/core/models/stations.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

// Load stations

export const stationsActions = createActionGroup({
  source: 'Stations Management',
  events: {
    'Load stations': emptyProps(),
    'Load stations success': props<{ stations: TStationListed[] }>(),
    'Load stations error': props<{ error: HttpErrorResponse }>(),

    'Create station': props<{ station: TStationCreation }>(),
    'Create station success': props<{ stations: TStationListed[] }>(),
    'Create station error': props<{ error: HttpErrorResponse }>(),

    'Delete station': props<{ id: number }>(),
    'Delete station success': props<{ id: number }>(),
    'Delete station error': props<{ error: HttpErrorResponse }>(),
  },
});
