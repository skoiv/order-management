import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { Store } from '@ngrx/store';
import * as OrderActions from '../../state/orders/order.actions';
import { Subject, takeUntil } from 'rxjs';
import {
  selectOrdersWithFallback,
  selectLoading,
  selectSelectedCountry,
  selectDescriptionFilter,
  selectAvailableCountries,
  selectError,
  selectFilteredOrdersByCountryAndDescription,
} from '../../state/orders/order.selectors';
import { NumberFormatPipe } from '../../pipes/number-format.pipe';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, NumberFormatPipe],
})
export class OrderListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'orderNumber',
    'description',
    'streetAddress',
    'town',
    'country',
    'amount',
    'currency',
    'paymentDueDate',
  ];

  private destroy$ = new Subject<void>();

  orders$ = this.store.select(selectOrdersWithFallback);
  filteredOrders$ = this.store.select(selectFilteredOrdersByCountryAndDescription);
  selectedCountry$ = this.store.select(selectSelectedCountry);
  descriptionFilter$ = this.store.select(selectDescriptionFilter);
  availableCountries$ = this.store.select(selectAvailableCountries);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  constructor(
    private router: Router,
    private store: Store,
  ) {
    // Subscribe to filter changes to update filtered orders
    this.filteredOrders$.pipe(takeUntil(this.destroy$)).subscribe(filteredOrders => {
      this.store.dispatch(OrderActions.updateFilteredOrders({ filteredOrders }));
    });
  }

  ngOnInit(): void {
    this.store.dispatch(OrderActions.loadOrders());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCountryChange(country: string): void {
    this.store.dispatch(OrderActions.setSelectedCountry({ country }));
  }

  onDescriptionChange(description: string): void {
    this.store.dispatch(OrderActions.setDescriptionFilter({ description }));
  }

  navigateToCreate(): void {
    this.router.navigate(['/orders/create']);
  }
}
