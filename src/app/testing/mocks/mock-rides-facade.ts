import { TRide } from '@/core/models/rides.model';
import { of } from 'rxjs';

export default class MockRidesFacade {
  state$ = of({});

  route$ = of({});

  load(routeId: number) {
    return routeId;
  }

  create(routeId: number, ride: Omit<TRide, 'id'>) {
    return { routeId, ride };
  }

  update(routeId: number, ride: TRide) {
    return { routeId, ride };
  }

  delete(routeId: number, rideId: number) {
    return { routeId, rideId };
  }
}
