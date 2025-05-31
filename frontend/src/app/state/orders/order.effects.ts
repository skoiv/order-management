import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import * as OrderActions from './order.actions';

@Injectable()
export class OrderEffects {
  private actions$ = inject(Actions);
  private orderService = inject(OrderService);

  loadOrders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      switchMap(() =>
        this.orderService.getOrders().pipe(
          map(orders => {
            // Sort orders to show Estonia orders first
            const sortedOrders = orders.sort((a, b) => {
              if (a.country === 'Estonia' && b.country !== 'Estonia') return -1;
              if (a.country !== 'Estonia' && b.country === 'Estonia') return 1;
              return 0;
            });
            return OrderActions.loadOrdersSuccess({ orders: sortedOrders });
          }),
          catchError(error =>
            of(OrderActions.loadOrdersFailure({ error: error.message || 'Failed to load orders' })),
          ),
        ),
      ),
    );
  });

  createOrder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrderActions.createOrder),
      switchMap(({ order }) =>
        this.orderService.createOrder(order).pipe(
          map(createdOrder => OrderActions.createOrderSuccess({ order: createdOrder })),
          catchError(error =>
            of(
              OrderActions.createOrderFailure({
                error: error.error?.message || 'Failed to create order',
              }),
            ),
          ),
        ),
      ),
    );
  });
}
