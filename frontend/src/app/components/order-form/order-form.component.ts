import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { Store } from '@ngrx/store';
import * as OrderActions from '../../state/orders/order.actions';
import * as OrderSelectors from '../../state/orders/order.selectors';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
})
export class OrderFormComponent implements OnDestroy {
  orderForm: FormGroup;
  serverError: string | null = null;
  private destroy$ = new Subject<void>();

  loading$ = this.store.select(OrderSelectors.selectLoading);
  error$ = this.store.select(OrderSelectors.selectError);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
  ) {
    this.orderForm = this.fb.group({
      orderNumber: ['', Validators.required],
      description: ['', Validators.required],
      streetAddress: ['', Validators.required],
      town: ['', Validators.required],
      country: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      currency: ['EUR', Validators.required],
      paymentDueDate: ['', Validators.required],
    });

    // Subscribe to store errors to handle duplicate order numbers
    this.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
      if (error?.includes('already exists')) {
        this.orderForm.get('orderNumber')?.setErrors({ duplicate: true });
        this.serverError = error;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      const order = {
        ...formValue,
        amount: formValue.amount.toString(),
        paymentDueDate:
          formValue.paymentDueDate instanceof Date
            ? formValue.paymentDueDate.toISOString().split('T')[0]
            : formValue.paymentDueDate,
      };

      this.store.dispatch(OrderActions.createOrder({ order }));
      this.store
        .select(OrderSelectors.selectError)
        .pipe(takeUntil(this.destroy$))
        .subscribe(error => {
          if (!error) {
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
          }
        });
    }
  }

  navigateToList(): void {
    this.router.navigate(['/orders']);
  }
}
