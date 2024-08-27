import { SearchRequest } from '@/core/models/search.model';
import { searchActions } from '@/redux/actions/search.actions';
import { searchFeature } from '@/redux/reducers/search.reducer';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchFacadeService {
  private store: Store = inject(Store);

  get state$() {
    return this.store.select(searchFeature.selectSearchState);
  }

  get tickets$() {
    return this.store.select(searchFeature.selectTickets);
  }

  get status$() {
    return this.store.select(searchFeature.selectStatus);
  }

  get error$() {
    return this.store.select(searchFeature.selectError);
  }

  get isLoading$() {
    return this.store.select(searchFeature.selectIsLoading);
  }

  public search(params: SearchRequest) {
    this.store.dispatch(searchActions.search({ params }));
    return this.store.select(searchFeature.selectSearchState).pipe(
      filter(({ isLoading }) => !isLoading),
      take(1),
    );
  }
}
