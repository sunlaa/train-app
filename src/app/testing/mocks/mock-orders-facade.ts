import { MakeOrderBody } from '@/core/models/orders.model';

export default class MockOrdersFacade {
  load(all?: boolean) {
    return all;
  }

  makeOrder(order: MakeOrderBody) {
    return order;
  }

  cancelOrder(id: number) {
    return id;
  }
}
