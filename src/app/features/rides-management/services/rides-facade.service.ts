import { TRide } from '@/core/models/rides.model';
import { ridesActions } from '@/redux/actions/rides.actions';
import { ridesFeature } from '@/redux/reducers/rides.reducer';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class RidesFacadeService {
  private store = inject(Store);

  get state$() {
    return this.store.select(ridesFeature.selectRidesState);
  }

  get route$() {
    return this.store.select(ridesFeature.selectRoute);
  }

  public load(routeId: number) {
    this.store.dispatch(ridesActions.load({ routeId }));
  }

  public create(routeId: number, ride: Omit<TRide, 'id'>) {
    this.store.dispatch(ridesActions.create({ routeId, ride }));
  }

  public update(routeId: number, ride: TRide) {
    this.store.dispatch(ridesActions.update({ routeId, ride }));
  }
}
