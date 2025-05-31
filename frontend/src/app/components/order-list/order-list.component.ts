import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  error: string | null = null;
  selectedCountry: string = '';
  descriptionFilter: string = '';
  availableCountries: string[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: orders => {
        // Sort orders to show Estonia orders first
        this.orders = orders.sort((a, b) => {
          if (a.country === 'Estonia' && b.country !== 'Estonia') return -1;
          if (a.country !== 'Estonia' && b.country === 'Estonia') return 1;
          return 0;
        });

        // Extract unique countries for the dropdown
        this.availableCountries = [...new Set(orders.map(order => order.country))].sort();

        // Initialize filtered orders
        this.applyFilters();
      },
      error: error => {
        console.error('Error fetching orders:', error);
        this.error = 'Failed to load orders. Please try again later.';
      },
    });
  }

  onCountryChange(): void {
    this.applyFilters();
  }

  onDescriptionChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesCountry = !this.selectedCountry || order.country === this.selectedCountry;
      const matchesDescription =
        !this.descriptionFilter ||
        order.description.toLowerCase().includes(this.descriptionFilter.toLowerCase());
      return matchesCountry && matchesDescription;
    });
  }

  navigateToCreate() {
    this.router.navigate(['/orders/create']);
  }
}
