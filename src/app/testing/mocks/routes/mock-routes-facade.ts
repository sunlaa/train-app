import { of } from 'rxjs';
import MockRoutesState from './mock-routes-state';

export default class MockRoutesFacade {
  state$ = of(MockRoutesState.successState);

  routes$ = of([]);

  load() {}

  create() {
    return this.state$;
  }

  update() {
    return this.state$;
  }

  delete() {
    return this.state$;
  }
}
