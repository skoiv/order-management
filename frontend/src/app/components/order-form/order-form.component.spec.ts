import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderFormComponent } from './order-form.component';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../shared/material.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as OrderActions from '../../state/orders/order.actions';
import * as OrderSelectors from '../../state/orders/order.selectors';

describe('OrderFormComponent', () => {
  let component: OrderFormComponent;
  let fixture: ComponentFixture<OrderFormComponent>;
  let router: jasmine.SpyObj<Router>;
  let store: MockStore;

  const initialState = {
    orders: {
      orders: [],
      filteredOrders: [],
      selectedCountry: '',
      descriptionFilter: '',
      availableCountries: [],
      loading: false,
      error: null,
    },
  };

  const validOrderData = {
    orderNumber: 'ORD-001',
    description: 'Test Order',
    streetAddress: '123 Test St',
    town: 'Test Town',
    country: 'Test Country',
    amount: '99.99',
    currency: 'EUR',
    paymentDueDate: '2024-12-31',
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaterialModule, NoopAnimationsModule, OrderFormComponent],
      providers: [provideMockStore({ initialState }), { provide: Router, useValue: routerSpy }],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
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
      const form = component.orderForm;
      expect(form.valid).toBeFalsy();

      form.controls['orderNumber'].setValue('');
      expect(form.controls['orderNumber'].errors?.['required']).toBeTruthy();

      form.controls['description'].setValue('');
      expect(form.controls['description'].errors?.['required']).toBeTruthy();

      form.controls['streetAddress'].setValue('');
      expect(form.controls['streetAddress'].errors?.['required']).toBeTruthy();

      form.controls['town'].setValue('');
      expect(form.controls['town'].errors?.['required']).toBeTruthy();

      form.controls['country'].setValue('');
      expect(form.controls['country'].errors?.['required']).toBeTruthy();

      form.controls['amount'].setValue('');
      expect(form.controls['amount'].errors?.['required']).toBeTruthy();
    });

    it('should validate amount format', () => {
      const amountControl = component.orderForm.get('amount');

      amountControl?.setValue('invalid');
      expect(amountControl?.errors?.['pattern']).toBeTruthy();

      amountControl?.setValue('99.99');
      expect(amountControl?.errors).toBeNull();

      amountControl?.setValue('100');
      expect(amountControl?.errors).toBeNull();

      amountControl?.setValue('99.999');
      expect(amountControl?.errors?.['pattern']).toBeTruthy();
    });

    it('should validate payment due date format', () => {
      const dueDateControl = component.orderForm.get('paymentDueDate');

      dueDateControl?.setValue(null);
      expect(dueDateControl?.errors?.['required']).toBeTruthy();

      const validDate = new Date('2024-12-31');
      dueDateControl?.setValue(validDate);
      expect(dueDateControl?.errors).toBeNull();

      const invalidDate = 'invalid';
      dueDateControl?.setValue(invalidDate);
      expect(dueDateControl?.errors?.['matDatepickerParse']).toBeTruthy();
    });

    it('should be valid when all fields are properly filled', () => {
      component.orderForm.patchValue(validOrderData);
      expect(component.orderForm.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    it('should not submit if form is invalid', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onSubmit();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch createOrder action on valid form submission', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.orderForm.patchValue(validOrderData);
      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(OrderActions.createOrder({ order: validOrderData }));
    });

    it('should handle duplicate order number error', fakeAsync(() => {
      const errorMessage = 'Order number already exists';
      store.overrideSelector(OrderSelectors.selectError, errorMessage);
      store.refreshState();
      fixture.detectChanges();
      tick();

      expect(component.orderForm.get('orderNumber')?.errors?.['duplicate']).toBeTruthy();
      expect(component.serverError).toBe(errorMessage);
    }));

    it('should navigate to list after successful submission', fakeAsync(() => {
      store.overrideSelector(OrderSelectors.selectError, null);
      store.overrideSelector(OrderSelectors.selectCreateOrderSuccess, true);
      store.refreshState();

      component.orderForm.patchValue(validOrderData);
      component.onSubmit();
      tick();

      expect(router.navigate).toHaveBeenCalledWith(['/orders']);
    }));
  });

  describe('Navigation', () => {
    it('should navigate to order list when back button is clicked', () => {
      component.navigateToList();
      expect(router.navigate).toHaveBeenCalledWith(['/orders']);
    });

    it('should render back button', () => {
      fixture.detectChanges();
      const backButton = fixture.nativeElement.querySelector('button[mat-button]');
      expect(backButton).toBeTruthy();
      expect(backButton.textContent).toContain('Back to List');
    });

    it('should navigate when back button is clicked', () => {
      fixture.detectChanges();
      const backButton = fixture.nativeElement.querySelector('button[mat-button]');
      backButton.click();
      expect(router.navigate).toHaveBeenCalledWith(['/orders']);
    });
  });
});
