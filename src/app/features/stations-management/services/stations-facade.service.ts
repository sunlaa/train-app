import { TStationCreation } from '@/core/models/stations.model';
import { stationsActions } from '@/redux/actions';
import { stationsFeature } from '@/redux/reducers';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StationsFacadeService {
  private store = inject(Store);

  get state$() {
    return this.store.select(stationsFeature.selectStationsState);
  }

  get stations$() {
    return this.store.select(stationsFeature.selectStations);
  }

  public load() {
    this.store.dispatch(stationsActions.load());
  }

  public create(station: TStationCreation) {
    this.store.dispatch(stationsActions.create({ station }));
    return this.store.select(stationsFeature.selectStationsState).pipe(
      filter(({ status }) => status !== 'loading'),
      take(1),
    );
  }

  public delete(id: number) {
    this.store.dispatch(stationsActions.delete({ id }));
    return this.store.select(stationsFeature.selectStationsState).pipe(
      filter(({ status }) => status !== 'loading'),
      take(1),
    );
  }
}
