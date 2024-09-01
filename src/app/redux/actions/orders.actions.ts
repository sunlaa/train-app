import { Order, MakeOrderBody } from '@/core/models/orders.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, props } from '@ngrx/store';

export const ordersActions = createActionGroup({
  source: 'Trip Details and Order Page',
  events: {
    Load: props<{ all?: boolean }>(),
    'Load success': props<{ orders: Order[] }>(),
    'Load error': props<{ error: HttpErrorResponse }>(),

    'Make order': props<{ order: MakeOrderBody }>(),
    'Order success': props<{ orders: Order[] }>(),
    'Order error': props<{ error: HttpErrorResponse }>(),

    'Cancel order': props<{ id: number }>(),
    'Cancel order success': props<{ id: number }>(),
    'Cancel order error': props<{ error: HttpErrorResponse }>(),
  },
});
