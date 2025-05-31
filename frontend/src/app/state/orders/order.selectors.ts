import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from './order.state';

export const selectOrderState = createFeatureSelector<OrderState>('orders');

export const selectOrders = createSelector(selectOrderState, state => state.orders);

export const selectFilteredOrders = createSelector(selectOrderState, state => state.filteredOrders);

export const selectSelectedCountry = createSelector(
  selectOrderState,
  state => state.selectedCountry,
);

export const selectDescriptionFilter = createSelector(
  selectOrderState,
  state => state.descriptionFilter,
);

export const selectAvailableCountries = createSelector(
  selectOrderState,
  state => state.availableCountries,
);

export const selectLoading = createSelector(selectOrderState, state => state.loading);

export const selectError = createSelector(selectOrderState, state => state.error);
