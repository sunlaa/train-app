import { of, Subject } from 'rxjs';
import { RidesState } from '@/redux/reducers';

export default class MockRidesFacade {
  private stateSubject = new Subject<RidesState>();

  state$ = this.stateSubject.asObservable();

  route$ = of({});

  load(routeId: number) {
    return routeId;
  }

  create() {
    return this.state$;
  }

  update() {
    return this.state$;
  }

  delete() {
    return this.state$;
  }

  setState(state: RidesState) {
    this.stateSubject.next(state);
  }
}
