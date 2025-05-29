import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orders: any[] = [];

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.ordersService.getOrders().subscribe({
      next: data => {
        this.orders = data;
      },
      error: error => {
        console.error('Error fetching orders:', error);
      },
    });
  }
}
