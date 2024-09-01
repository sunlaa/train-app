import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { OrdersService } from '@/features/orders/services/orders/orders.service';
import { ordersActions } from '../actions/orders.actions';

@Injectable()
export class OrdersEffects {
  constructor(
    private actions$: Actions,
    private ordersService: OrdersService,
  ) {}

  loadOrders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ordersActions.load),
      switchMap(({ all }) =>
        this.ordersService.getOrders(all).pipe(
          map((orders) => ordersActions.loadSuccess({ orders })),
          catchError((error) => of(ordersActions.loadError({ error }))),
        ),
      ),
    );
  });

  makeOrder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ordersActions.makeOrder),
      switchMap(({ order }) =>
        this.ordersService.makeOrder(order).pipe(
          switchMap(() =>
            this.ordersService.getOrders().pipe(
              map((orders) => ordersActions.orderSuccess({ orders })),
              catchError((error) => of(ordersActions.orderError({ error }))),
            ),
          ),
          catchError((error) => of(ordersActions.orderError({ error }))),
        ),
      ),
    );
  });

  cancelOrder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ordersActions.cancelOrder),
      switchMap(({ id, isAdmin }) =>
        this.ordersService.deleteOrder(id).pipe(
          map(() => ordersActions.cancelOrderSuccess({ id, isAdmin })),
          catchError((error) => of(ordersActions.cancelOrderError({ error }))),
        ),
      ),
    );
  });
}
