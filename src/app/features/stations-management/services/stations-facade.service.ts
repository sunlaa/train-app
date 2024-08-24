import { stationsActions } from '@/redux/actions';
import { stationsFeature } from '@/redux/reducers';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class StationsFacadeService {
  private store = inject(Store);

  get state$() {
    return this.store.select(stationsFeature.selectStationsState);
  }

  public load() {
    this.store.dispatch(stationsActions.load());
  }
}
