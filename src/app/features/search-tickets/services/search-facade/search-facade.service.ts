import { searchFeature } from '@/redux/reducers/search.reducer';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class SearchFacadeService {
  store: Store = inject(Store);

  get state$() {
    return this.store.select(searchFeature.selectSearchState);
  }

  get tickets$() {
    return this.store.select(searchFeature.selectTickets);
  }
}
