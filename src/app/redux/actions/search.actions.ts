import { FilteredTickets, SearchRequest } from '@/core/models/search.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, props } from '@ngrx/store';

export const searchActions = createActionGroup({
  source: 'Search Page',
  events: {
    Search: props<{ params: SearchRequest }>(),
    'Search success': props<{ tickets: FilteredTickets }>(),
    'Search error': props<{ error: HttpErrorResponse }>(),
  },
});
