import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    this.orderForm = this.fb.group({
      orderNumber: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      // Ensure amount is a string
      const order = {
        ...formValue,
        amount: formValue.amount.toString()
      };
      
      this.orderService.createOrder(order).subscribe({
        next: () => {
          this.orderForm.reset();
          // TODO: Add success notification
        },
        error: (error) => {
          console.error('Error creating order:', error);
          // TODO: Add error notification
        }
      });
    }
  }
} 