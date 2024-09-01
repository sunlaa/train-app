import { MakeOrderBody, Order } from '@/core/models/orders.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseURL = '/api/order';

  private httpClient = inject(HttpClient);

  public getOrders(all?: boolean) {
    return this.httpClient.get<Order[]>(this.baseURL, {
      params: {
        all: !!all,
      },
    });
  }

  public makeOrder(body: MakeOrderBody) {
    return this.httpClient.post(this.baseURL, body);
  }

  public deleteOrder(orderId: number) {
    return this.httpClient.delete<void>(`${this.baseURL}/${orderId}`);
  }
}
