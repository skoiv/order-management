import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderFormComponent } from './order-form.component';
import { OrderService } from '../../services/order.service';
import { of } from 'rxjs';

describe('OrderFormComponent', () => {
  let component: OrderFormComponent;
  let fixture: ComponentFixture<OrderFormComponent>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('OrderService', ['createOrder']);
    spy.createOrder.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, OrderFormComponent],
      providers: [
        { provide: OrderService, useValue: spy }
      ]
    }).compileComponents();

    orderServiceSpy = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.orderForm.get('orderNumber')?.value).toBe('');
    expect(component.orderForm.get('description')?.value).toBe('');
    expect(component.orderForm.get('amount')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.orderForm;
    expect(form.valid).toBeFalsy();
    
    form.controls['orderNumber'].setValue('ORD-001');
    form.controls['description'].setValue('Test Order');
    form.controls['amount'].setValue('100.00');
    
    expect(form.valid).toBeTruthy();
  });

  it('should submit form with valid data', () => {
    const form = component.orderForm;
    const mockOrder = {
      orderNumber: 'ORD-001',
      description: 'Test Order',
      amount: '100.00'
    };

    form.controls['orderNumber'].setValue(mockOrder.orderNumber);
    form.controls['description'].setValue(mockOrder.description);
    form.controls['amount'].setValue(mockOrder.amount);

    component.onSubmit();

    expect(orderServiceSpy.createOrder).toHaveBeenCalledWith(mockOrder);
  });

  it('should not submit form with invalid data', () => {
    const form = component.orderForm;
    form.controls['orderNumber'].setValue('');
    form.controls['description'].setValue('');
    form.controls['amount'].setValue('');

    component.onSubmit();

    expect(orderServiceSpy.createOrder).not.toHaveBeenCalled();
  });
}); 