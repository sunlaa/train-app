import { SearchRequest, Ticket } from '@/core/models/search.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, props } from '@ngrx/store';

export const searchActions = createActionGroup({
  source: 'Search Page',
  events: {
    Search: props<{ params: SearchRequest }>(),
    'Search success': props<{ tickets: Ticket[] }>(),
    'Search error': props<{ error: HttpErrorResponse }>(),
  },
});
