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
);
