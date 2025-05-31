import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from './order.state';
import { Order } from '../../models/order.interface';

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

export const selectCreateOrderSuccess = createSelector(
  selectOrderState,
  state => state.createOrderSuccess,
);

export const selectDuplicateOrderError = createSelector(selectError, error =>
  error?.includes('already exists') ? error : null,
);

export const selectFormattedAmount = (amount: string | null) => {
  if (!amount) return amount;

  // Remove all spaces and replace dots with commas
  const cleanValue = amount.toString().replace(/\s/g, '').replace('.', ',');

  // Add thousand separators (spaces)
  const parts = cleanValue.split(',');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join(',');
};

export const selectOrdersWithFallback = createSelector(
  selectOrders,
  (orders): Order[] => orders || [],
);

export const selectFilteredOrdersWithFallback = createSelector(
  selectFilteredOrders,
  (orders): Order[] => orders || [],
);

export const selectFilteredOrdersByCountryAndDescription = createSelector(
  selectOrders,
  selectSelectedCountry,
  selectDescriptionFilter,
  (orders, selectedCountry, descriptionFilter): Order[] => {
    return orders.filter(order => {
      const matchesCountry = !selectedCountry || order.country === selectedCountry;
      const matchesDescription =
        !descriptionFilter ||
        order.description.toLowerCase().includes(descriptionFilter.toLowerCase());
      return matchesCountry && matchesDescription;
    });
  },
);
