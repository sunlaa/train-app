import { Order, MakeOrderBody } from '@/core/models/orders.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ordersActions = createActionGroup({
  source: 'Trip Details and Order Page',
  events: {
    Load: emptyProps(),
    'Load success': props<{ orders: Order[] }>(),
    'Load error': props<{ error: HttpErrorResponse }>(),

    'Make order': props<{ order: MakeOrderBody }>(),
    'Order success': props<{ orders: Order[] }>(),
    'Order error': props<{ error: HttpErrorResponse }>(),

    'Delete order': props<{ id: number }>(),
    'Delete order success': props<{ id: number }>(),
    'Delete order error': props<{ error: HttpErrorResponse }>(),
  },
});
