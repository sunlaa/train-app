import { TRoute } from '@/core/models/routes.model';
import { routesActions } from '@/redux/actions';
import { routesFeature } from '@/redux/reducers';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutesFacadeService {
  private store = inject(Store);

  get state$() {
    return this.store.select(routesFeature.selectRoutesState);
  }

  public load() {
    this.store.dispatch(routesActions.load());
  }

  public create(route: Omit<TRoute, 'id'>) {
    this.store.dispatch(routesActions.create({ route }));
    return this.store.select(routesFeature.selectRoutesState).pipe(
      filter(({ status }) => status !== 'loading'),
      take(1),
    );
  }

  public update(route: TRoute) {
    this.store.dispatch(routesActions.update({ route }));
    return this.store.select(routesFeature.selectRoutesState).pipe(
      filter(({ status }) => status !== 'loading'),
      take(1),
    );
  }

  public delete(id: number) {
    this.store.dispatch(routesActions.delete({ id }));
    return this.store.select(routesFeature.selectRoutesState).pipe(
      filter(({ status }) => status !== 'loading'),
      take(1),
    );
  }
}
