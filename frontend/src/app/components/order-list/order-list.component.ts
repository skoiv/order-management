import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.interface';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: orders => {
        this.orders = orders;
      },
      error: error => {
        console.error('Error fetching orders:', error);
        this.error = 'Failed to load orders. Please try again later.';
      },
    });
  }
}
