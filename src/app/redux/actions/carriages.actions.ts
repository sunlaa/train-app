import { TCarriage } from '@/core/models/carriages.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const carriagesActions = createActionGroup({
  source: 'Carriages Management',
  events: {
    Load: emptyProps(),
    'Load success': props<{ carriages: TCarriage[] }>(),
    'Load error': props<{ error: HttpErrorResponse }>(),

    Create: props<{ carriage: Omit<TCarriage, 'code'> }>(),
    'Create success': props<{ carriage: TCarriage }>(),
    'Create error': props<{ error: HttpErrorResponse }>(),

    Update: props<{ carriage: TCarriage }>(),
    'Update success': props<{ carriage: TCarriage }>(),
    'Update error': props<{ error: HttpErrorResponse }>(),

    Delete: props<{ code: string }>(),
    'Delete success': props<{ code: string }>(),
    'Delete error': props<{ error: HttpErrorResponse }>(),
  },
});
