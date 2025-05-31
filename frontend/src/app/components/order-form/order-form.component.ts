import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class OrderFormComponent implements OnInit, OnDestroy {
  orderForm: FormGroup;
  serverError: string | null = null;
  private destroy$ = new Subject<void>();
  private isNavigating = false;

  loading$ = this.store.select(OrderSelectors.selectLoading);
  error$ = this.store.select(OrderSelectors.selectError);
  createOrderSuccess$ = this.store.select(OrderSelectors.selectCreateOrderSuccess);
  duplicateError$ = this.store.select(OrderSelectors.selectDuplicateOrderError);

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
      amount: ['', [Validators.required, Validators.pattern(/^\d+(?:\s\d{3})*(?:,\d{1,2})?$/)]],
      currency: ['EUR', Validators.required],
      paymentDueDate: ['', Validators.required],
    });

    // Subscribe to duplicate order errors
    this.duplicateError$.pipe(takeUntil(this.destroy$)).subscribe(error => {
      if (error && !this.isNavigating) {
        this.orderForm.get('orderNumber')?.setErrors({ duplicate: true });
        this.serverError = error;
      }
    });

    // Subscribe to success state to handle navigation
    this.createOrderSuccess$.pipe(takeUntil(this.destroy$)).subscribe(success => {
      if (success && !this.isNavigating) {
        this.isNavigating = true;
        this.store.dispatch(OrderActions.resetCreateOrderSuccess());
        this.navigateToList();
      }
    });

    // Subscribe to amount changes to format the input
    this.orderForm
      .get('amount')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (!this.isNavigating) {
          const formattedValue = OrderSelectors.selectFormattedAmount(value);
          if (formattedValue !== value) {
            this.orderForm.get('amount')?.setValue(formattedValue, { emitEvent: false });
          }
        }
      });
  }

  ngOnInit(): void {
    // Reset create success state when component initializes
    this.store.dispatch(OrderActions.resetCreateOrderSuccess());
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
        amount: formValue.amount.replace(/\s/g, '').replace(',', '.'),
        paymentDueDate:
          formValue.paymentDueDate instanceof Date
            ? formValue.paymentDueDate.toISOString().split('T')[0]
            : formValue.paymentDueDate,
      };

      this.store.dispatch(OrderActions.createOrder({ order }));
    }
  }

  navigateToList(): void {
    this.router.navigate(['/orders']);
  }
}
