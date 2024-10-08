import { TRide } from '@/core/models/rides.model';
import { ridesActions } from '@/redux/actions/rides.actions';
import { ridesFeature } from '@/redux/reducers/rides.reducer';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';

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
    return this.state$.pipe(
      filter(({ status }) => status !== 'loading'),
      take(1),
    );
  }

  public update(routeId: number, ride: TRide) {
    this.store.dispatch(ridesActions.update({ routeId, ride }));
    return this.state$.pipe(
      filter(({ status }) => status !== 'loading'),
      take(1),
    );
  }

  public delete(routeId: number, rideId: number) {
    this.store.dispatch(ridesActions.delete({ routeId, rideId }));
    return this.state$.pipe(
      filter(({ status }) => status !== 'loading'),
      take(1),
    );
  }
}
