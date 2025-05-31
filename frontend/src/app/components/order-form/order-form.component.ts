import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class OrderFormComponent {
  orderForm: FormGroup;
  serverError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router,
  ) {
    this.orderForm = this.fb.group({
      orderNumber: ['', Validators.required],
      description: ['', Validators.required],
      streetAddress: ['', Validators.required],
      town: ['', Validators.required],
      country: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      currency: ['EUR', Validators.required],
      paymentDueDate: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
    });
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      this.serverError = null;
      const formValue = this.orderForm.value;
      const order = {
        ...formValue,
        amount: formValue.amount.toString(),
        paymentDueDate: formValue.paymentDueDate,
      };

      this.orderService.createOrder(order).subscribe({
        next: () => {
          this.orderForm.reset({
            orderNumber: '',
            description: '',
            streetAddress: '',
            town: '',
            country: '',
            amount: '',
            currency: 'EUR',
            paymentDueDate: '',
          });
          this.navigateToList();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.orderForm.get('orderNumber')?.setErrors({ duplicate: true });
            this.serverError = error.error.message;
          }
        },
      });
    }
  }

  navigateToList() {
    this.router.navigate(['/orders']);
  }
}
