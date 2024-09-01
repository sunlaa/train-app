import { MakeOrderBody } from '@/core/models/orders.model';
import { ordersActions } from '@/redux/actions/orders.actions';
import { ordersFeature } from '@/redux/reducers/orders.reducer';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersFacadeService {
  private store: Store = inject(Store);

  get state$() {
    return this.store.select(ordersFeature.selectOrdersState);
  }

  get orders$() {
    return this.store.select(ordersFeature.selectOrders);
  }

  get status$() {
    return this.store.select(ordersFeature.selectStatus);
  }

  get error$() {
    return this.store.select(ordersFeature.selectError);
  }

  load(all?: boolean) {
    this.store.dispatch(ordersActions.load({ all }));
  }

  makeOrder(order: MakeOrderBody) {
    this.store.dispatch(ordersActions.makeOrder({ order }));
  }

  cancelOrder(id: number, isAdmin?: boolean) {
    this.store.dispatch(ordersActions.cancelOrder({ id, isAdmin }));
    return this.state$.pipe(
      filter((st) => st.status !== 'loading'),
      take(1),
      map((st) => st.error),
    );
  }
}
