import { MakeOrderBody } from '@/core/models/orders.model';
import { ordersActions } from '@/redux/actions/orders.actions';
import { orderFeature } from '@/redux/reducers/orders.reducer';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class OrdersFacadeService {
  private store: Store = inject(Store);

  get state$() {
    return this.store.select(orderFeature.selectOrdersState);
  }

  get orders$() {
    return this.store.select(orderFeature.selectOrders);
  }

  get status$() {
    return this.store.select(orderFeature.selectStatus);
  }

  get error$() {
    return this.store.select(orderFeature.selectError);
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
