import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderFormComponent } from './order-form.component';
import { OrderService } from '../../services/order.service';
import { of, throwError } from 'rxjs';

describe('OrderFormComponent', () => {
  let component: OrderFormComponent;
  let fixture: ComponentFixture<OrderFormComponent>;
  let orderService: jasmine.SpyObj<OrderService>;

  const validOrderData = {
    orderNumber: 'ORD-001',
    description: 'Test Order',
    streetAddress: '123 Test St',
    town: 'Test Town',
    country: 'Test Country',
    amount: '99.99',
    currency: 'EUR',
    paymentDueDate: '2024-12-31'
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('OrderService', ['createOrder']);
    spy.createOrder.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, OrderFormComponent],
      providers: [
        { provide: OrderService, useValue: spy }
      ]
    }).compileComponents();

    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form fields and default currency', () => {
    expect(component.orderForm.get('orderNumber')?.value).toBe('');
    expect(component.orderForm.get('description')?.value).toBe('');
    expect(component.orderForm.get('streetAddress')?.value).toBe('');
    expect(component.orderForm.get('town')?.value).toBe('');
    expect(component.orderForm.get('country')?.value).toBe('');
    expect(component.orderForm.get('amount')?.value).toBe('');
    expect(component.orderForm.get('currency')?.value).toBe('EUR');
    expect(component.orderForm.get('paymentDueDate')?.value).toBe('');
  });

  it('should be invalid when empty', () => {
    expect(component.orderForm.valid).toBeFalsy();
  });

  describe('Form Field Validation', () => {
    it('should validate required fields', () => {
      // First check non-currency fields
      Object.keys(validOrderData)
        .filter(key => key !== 'currency')
        .forEach(key => {
          const control = component.orderForm.get(key);
          expect(control?.errors?.['required'])
            .withContext(`Field ${key} should have required error when empty`)
            .toBeTruthy();
        });

      // Separately test currency field by clearing its value
      const currencyControl = component.orderForm.get('currency');
      currencyControl?.setValue(null);
      expect(currencyControl?.errors?.['required'])
        .withContext('Currency field should have required error when cleared')
        .toBeTruthy();
    });

    it('should validate amount format', () => {
      const amountControl = component.orderForm.get('amount');
      
      amountControl?.setValue('invalid');
      expect(amountControl?.errors?.['pattern']).toBeTruthy();

      amountControl?.setValue('99.99');
      expect(amountControl?.errors).toBeNull();

      amountControl?.setValue('1000');
      expect(amountControl?.errors).toBeNull();

      amountControl?.setValue('99.999');
      expect(amountControl?.errors?.['pattern']).toBeTruthy();
    });

    it('should validate payment due date format', () => {
      const dueDateControl = component.orderForm.get('paymentDueDate');
      
      dueDateControl?.setValue('invalid');
      expect(dueDateControl?.errors?.['pattern']).toBeTruthy();

      dueDateControl?.setValue('2024-12-31');
      expect(dueDateControl?.errors).toBeNull();

      dueDateControl?.setValue('31-12-2024');
      expect(dueDateControl?.errors?.['pattern']).toBeTruthy();
    });

    it('should be valid when all fields are properly filled', () => {
      component.orderForm.patchValue(validOrderData);
      expect(component.orderForm.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(orderService.createOrder).not.toHaveBeenCalled();
    });

    it('should call createOrder service method on valid form submission', () => {
      component.orderForm.patchValue(validOrderData);
      component.onSubmit();
      expect(orderService.createOrder).toHaveBeenCalledWith(validOrderData);
    });

    it('should reset form with default currency after successful submission', () => {
      component.orderForm.patchValue(validOrderData);
      component.onSubmit();

      expect(component.orderForm.get('currency')?.value).toBe('EUR');
      expect(component.orderForm.get('orderNumber')?.value).toBe('');
      expect(component.orderForm.get('description')?.value).toBe('');
      expect(component.orderForm.get('streetAddress')?.value).toBe('');
    });

    it('should handle error on form submission', () => {
      orderService.createOrder.and.returnValue(throwError(() => new Error('Test error')));
      spyOn(console, 'error');

      component.orderForm.patchValue(validOrderData);
      component.onSubmit();

      expect(console.error).toHaveBeenCalled();
      expect(component.orderForm.value).toEqual(validOrderData);
    });
  });

  describe('Currency Handling', () => {
    it('should accept valid currencies', () => {
      const currencyControl = component.orderForm.get('currency');
      
      ['EUR', 'USD', 'GBP'].forEach(currency => {
        currencyControl?.setValue(currency);
        expect(currencyControl?.errors).toBeNull();
      });
    });

    it('should maintain EUR as default after reset', () => {
      component.orderForm.patchValue(validOrderData);
      component.onSubmit();
      expect(component.orderForm.get('currency')?.value).toBe('EUR');
    });
  });
}); 