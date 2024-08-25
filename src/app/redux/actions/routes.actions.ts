import { TRoute } from '@/core/models/routes.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const routesActions = createActionGroup({
  source: 'Routes Management',
  events: {
    Load: emptyProps(),
    'Load success': props<{ routes: TRoute[] }>(),
    'Load error': props<{ error: HttpErrorResponse }>(),

    Create: props<{ route: Omit<TRoute, 'id'> }>(),
    'Create success': props<{ route: TRoute }>(),
    'Create error': props<{ error: HttpErrorResponse }>(),

    Update: props<{ route: TRoute }>(),
    'Update success': props<{ route: TRoute }>(),
    'Update error': props<{ error: HttpErrorResponse }>(),

    Delete: props<{ id: number }>(),
    'Delete success': props<{ id: number }>(),
    'Delete error': props<{ error: HttpErrorResponse }>(),
  },
});
