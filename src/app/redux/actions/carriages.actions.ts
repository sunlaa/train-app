import { TCarriage } from '@/core/models/carriages.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const carriagesActions = createActionGroup({
  source: 'Carriages Management',
  events: {
    'Load carriages': emptyProps(),
    'Load carriages success': props<{ carriages: TCarriage[] }>(),
    'Load carriages error': props<{ error: HttpErrorResponse }>(),

    'Create carriage': props<{ carriage: Omit<TCarriage, 'code'> }>(),
    'Create carriage success': props<{ carriage: TCarriage }>(),
    'Create carriage error': props<{ error: HttpErrorResponse }>(),

    'Update carriage': props<{ carriage: TCarriage }>(),
    'Update carriage success': props<{ carriage: TCarriage }>(),
    'Update carriage error': props<{ error: HttpErrorResponse }>(),

    'Delete carriage': props<{ code: string }>(),
    'Delete carriage success': props<{ code: string }>(),
    'Delete carriage error': props<{ error: HttpErrorResponse }>(),
  },
});
