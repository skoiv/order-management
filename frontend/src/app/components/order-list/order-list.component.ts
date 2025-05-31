import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.interface';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { Store } from '@ngrx/store';
import * as OrderActions from '../../state/orders/order.actions';
import * as OrderSelectors from '../../state/orders/order.selectors';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
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

  orders$ = this.store.select(OrderSelectors.selectOrders);
  filteredOrders$ = this.store.select(OrderSelectors.selectFilteredOrders);
  selectedCountry$ = this.store.select(OrderSelectors.selectSelectedCountry);
  descriptionFilter$ = this.store.select(OrderSelectors.selectDescriptionFilter);
  availableCountries$ = this.store.select(OrderSelectors.selectAvailableCountries);
  loading$ = this.store.select(OrderSelectors.selectLoading);
  error$ = this.store.select(OrderSelectors.selectError);

  constructor(
    private orderService: OrderService,
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.loadOrders();

    // Subscribe to filter changes to update filtered orders
    this.selectedCountry$.pipe(takeUntil(this.destroy$)).subscribe(() => this.applyFilters());
    this.descriptionFilter$.pipe(takeUntil(this.destroy$)).subscribe(() => this.applyFilters());
    this.orders$.pipe(takeUntil(this.destroy$)).subscribe(() => this.applyFilters());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOrders(): void {
    this.store.dispatch(OrderActions.loadOrders());
    this.orderService.getOrders().subscribe({
      next: orders => {
        // Sort orders to show Estonia orders first
        const sortedOrders = orders.sort((a, b) => {
          if (a.country === 'Estonia' && b.country !== 'Estonia') return -1;
          if (a.country !== 'Estonia' && b.country === 'Estonia') return 1;
          return 0;
        });
        this.store.dispatch(OrderActions.loadOrdersSuccess({ orders: sortedOrders }));
      },
      error: error => {
        console.error('Error fetching orders:', error);
        this.store.dispatch(
          OrderActions.loadOrdersFailure({
            error: 'Failed to load orders. Please try again later.',
          }),
        );
      },
    });
  }

  onCountryChange(country: string): void {
    this.store.dispatch(OrderActions.setSelectedCountry({ country }));
  }

  onDescriptionChange(description: string): void {
    this.store.dispatch(OrderActions.setDescriptionFilter({ description }));
  }

  private applyFilters(): void {
    let selectedCountry: string = '';
    let descriptionFilter: string = '';
    let orders: Order[] = [];

    // Get current filter values
    this.selectedCountry$
      .pipe(takeUntil(this.destroy$))
      .subscribe(country => (selectedCountry = country));
    this.descriptionFilter$
      .pipe(takeUntil(this.destroy$))
      .subscribe(description => (descriptionFilter = description));
    this.orders$.pipe(takeUntil(this.destroy$)).subscribe(orderList => (orders = orderList));

    const filteredOrders = orders.filter(order => {
      const matchesCountry = !selectedCountry || order.country === selectedCountry;
      const matchesDescription =
        !descriptionFilter ||
        order.description.toLowerCase().includes(descriptionFilter.toLowerCase());
      return matchesCountry && matchesDescription;
    });

    this.store.dispatch(OrderActions.updateFilteredOrders({ filteredOrders }));
  }

  navigateToCreate(): void {
    this.router.navigate(['/orders/create']);
  }
}
