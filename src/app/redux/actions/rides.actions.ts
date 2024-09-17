import { TRide, TRouteRides } from '@/core/models/rides.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, props } from '@ngrx/store';

export const ridesActions = createActionGroup({
  source: 'Rides Management',
  events: {
    Load: props<{ routeId: TRouteRides['id'] }>(),
    'Load success': props<{ route: TRouteRides }>(),
    'Load error': props<{ error: HttpErrorResponse }>(),

    Create: props<{ routeId: TRouteRides['id']; ride: Omit<TRide, 'id'> }>(),
    'Create success': props<{ ride: TRide }>(),
    'Create error': props<{ error: HttpErrorResponse }>(),

    Update: props<{ routeId: TRouteRides['id']; ride: TRide }>(),
    'Update success': props<{ ride: TRide }>(),
    'Update error': props<{ error: HttpErrorResponse }>(),

    Delete: props<{ routeId: TRouteRides['id']; rideId: TRide['id'] }>(),
    'Delete success': props<{ rideId: TRide['id'] }>(),
    'Delete error': props<{ error: HttpErrorResponse }>(),
  },
});
