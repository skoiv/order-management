import { createReducer, on } from '@ngrx/store';
import { initialState, OrderState } from './order.state';
import * as OrderActions from './order.actions';

export const orderReducer = createReducer(
  initialState,
  on(
    OrderActions.loadOrders,
    (state): OrderState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    OrderActions.loadOrdersSuccess,
    (state, { orders }): OrderState => ({
      ...state,
      loading: false,
      orders,
      availableCountries: [...new Set(orders.map(order => order.country))].sort(),
    }),
  ),
  on(
    OrderActions.loadOrdersFailure,
    (state, { error }): OrderState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
  on(
    OrderActions.setSelectedCountry,
    (state, { country }): OrderState => ({
      ...state,
      selectedCountry: country,
    }),
  ),
  on(
    OrderActions.setDescriptionFilter,
    (state, { description }): OrderState => ({
      ...state,
      descriptionFilter: description,
    }),
  ),
  on(
    OrderActions.updateFilteredOrders,
    (state, { filteredOrders }): OrderState => ({
      ...state,
      filteredOrders,
    }),
  ),
  on(
    OrderActions.createOrder,
    (state): OrderState => ({
      ...state,
      loading: true,
      error: null,
      createOrderSuccess: false,
    }),
  ),
  on(
    OrderActions.createOrderSuccess,
    (state, { order }): OrderState => ({
      ...state,
      loading: false,
      orders: [...state.orders, order],
      availableCountries: [...new Set([...state.orders, order].map(o => o.country))].sort(),
      createOrderSuccess: true,
    }),
  ),
  on(
    OrderActions.createOrderFailure,
    (state, { error }): OrderState => ({
      ...state,
      loading: false,
      error,
      createOrderSuccess: false,
    }),
  ),
  on(
    OrderActions.resetCreateOrderSuccess,
    (state): OrderState => ({
      ...state,
      createOrderSuccess: false,
    }),
  ),
);
