import { TStationCreation, TStationListed } from '@/core/models/stations.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

// Load stations

export const stationsActions = createActionGroup({
  source: 'Stations Management',
  events: {
    Load: emptyProps(),
    'Load success': props<{ stations: TStationListed[] }>(),
    'Load error': props<{ error: HttpErrorResponse }>(),

    Create: props<{ station: TStationCreation }>(),
    'Create success': props<{ stations: TStationListed[] }>(),
    'Create error': props<{ error: HttpErrorResponse }>(),

    Delete: props<{ id: number }>(),
    'Delete success': props<{ id: number }>(),
    'Delete error': props<{ error: HttpErrorResponse }>(),
  },
});
