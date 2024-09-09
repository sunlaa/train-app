import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { SearchService } from '@/features/search-tickets/services/search/search.service';
import { searchActions } from '../actions/search.actions';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private searchService: SearchService,
  ) {}

  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchActions.search),
      switchMap(({ params }) =>
        this.searchService.search(params).pipe(
          map((tickets) => searchActions.searchSuccess({ tickets })),
          catchError((error) => of(searchActions.searchError({ error }))),
        ),
      ),
    );
  });
}
