import { TRoute } from '@/core/models/routes.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const routesActions = createActionGroup({
  source: 'Routes Management',
  events: {
    'Load routes': emptyProps(),
    'Load routes success': props<{ routes: TRoute[] }>(),
    'Load routes error': props<{ error: HttpErrorResponse }>(),

    'Create route': props<{ route: Omit<TRoute, 'id'> }>(),
    'Create route success': props<{ route: TRoute }>(),
    'Create route error': props<{ error: HttpErrorResponse }>(),

    'Update route': props<{ route: TRoute }>(),
    'Update route success': props<{ route: TRoute }>(),
    'Update route error': props<{ error: HttpErrorResponse }>(),

    'Delete route': props<{ id: number }>(),
    'Delete route success': props<{ id: number }>(),
    'Delete route error': props<{ error: HttpErrorResponse }>(),
  },
});
