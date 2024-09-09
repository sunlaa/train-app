import { OrderState } from '@/redux/reducers/orders.reducer';
import { map, Subject } from 'rxjs';

export default class MockOrdersFacade {
  private stateSubject = new Subject<OrderState>();

  state$ = this.stateSubject.asObservable();

  load() {
    return this.state$;
  }

  makeOrder() {
    return this.state$;
  }

  cancelOrder() {
    return this.state$.pipe(map(({ error }) => error));
  }

  setState(state: OrderState) {
    this.stateSubject.next(state);
  }
}
