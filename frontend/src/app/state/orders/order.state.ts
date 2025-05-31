import { Order } from '../../models/order.interface';

export interface OrderState {
  orders: Order[];
  filteredOrders: Order[];
  selectedCountry: string;
  descriptionFilter: string;
  availableCountries: string[];
  loading: boolean;
  error: string | null;
}

export const initialState: OrderState = {
  orders: [],
  filteredOrders: [],
  selectedCountry: '',
  descriptionFilter: '',
  availableCountries: [],
  loading: false,
  error: null,
};
