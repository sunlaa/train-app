import { MakeOrderBody } from '@/core/models/orders.model';
import { ordersActions } from '@/redux/actions/orders.actions';
import { ordersFeature } from '@/redux/reducers/orders.reducer';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

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

  load() {
    this.store.dispatch(ordersActions.load());
  }

  makeOrder(order: MakeOrderBody) {
    this.store.dispatch(ordersActions.makeOrder({ order }));
  }

  deleteOrder(id: number) {
    this.store.dispatch(ordersActions.deleteOrder({ id }));
  }
}
