import { createAction, props } from '@ngrx/store';
import { Order } from '../../models/order.interface';

export const loadOrders = createAction('[Orders] Load Orders');

export const loadOrdersSuccess = createAction(
  '[Orders] Load Orders Success',
  props<{ orders: Order[] }>(),
);

export const loadOrdersFailure = createAction(
  '[Orders] Load Orders Failure',
  props<{ error: string }>(),
);

export const setSelectedCountry = createAction(
  '[Orders] Set Selected Country',
  props<{ country: string }>(),
);

export const setDescriptionFilter = createAction(
  '[Orders] Set Description Filter',
  props<{ description: string }>(),
);

export const updateFilteredOrders = createAction(
  '[Orders] Update Filtered Orders',
  props<{ filteredOrders: Order[] }>(),
);

export const createOrder = createAction('[Order] Create Order', props<{ order: Order }>());

export const createOrderSuccess = createAction(
  '[Order] Create Order Success',
  props<{ order: Order }>(),
);

export const createOrderFailure = createAction(
  '[Order] Create Order Failure',
  props<{ error: string }>(),
);
