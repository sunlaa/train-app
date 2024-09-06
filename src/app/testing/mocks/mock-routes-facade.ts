import { TRoute } from '@/core/models/routes.model';
import { of } from 'rxjs';

export default class MockRoutesFacade {
  state$ = of({});

  routes$ = of([]);

  load() {}

  create(route: Omit<TRoute, 'id'>) {
    return route;
  }

  update(route: TRoute) {
    return route;
  }

  delete(id: number) {
    return id;
  }
}
