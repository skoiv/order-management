import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrderListComponent } from './order-list.component';
import { OrderService } from '../../services/order.service';
import { of, throwError } from 'rxjs';
import { Order } from '../../models/order.interface';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let orderService: jasmine.SpyObj<OrderService>;

  const mockOrders: Order[] = [
    {
      orderNumber: 'ORD-001',
      description: 'Test Order 1',
      streetAddress: '123 Test St',
      town: 'Test Town',
      country: 'Estonia',
      amount: '100.50',
      currency: 'EUR',
      paymentDueDate: '2024-12-31',
    },
    {
      orderNumber: 'ORD-002',
      description: 'Test Order 2',
      streetAddress: '456 Test Ave',
      town: 'Another Town',
      country: 'Latvia',
      amount: '200.75',
      currency: 'EUR',
      paymentDueDate: '2024-11-30',
    },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('OrderService', ['getOrders']);
    spy.getOrders.and.returnValue(of([])); // Default return value

    await TestBed.configureTestingModule({
      imports: [OrderListComponent],
      providers: [{ provide: OrderService, useValue: spy }],
    }).compileComponents();

    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    orderService.getOrders.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load orders on init', fakeAsync(() => {
    orderService.getOrders.and.returnValue(of(mockOrders));
    fixture.detectChanges();
    tick();

    expect(component.orders).toEqual(mockOrders);
    expect(component.error).toBeNull();
    expect(orderService.getOrders).toHaveBeenCalled();
  }));

  it('should handle error when loading orders fails', fakeAsync(() => {
    const errorMessage = 'Failed to fetch orders';
    orderService.getOrders.and.returnValue(throwError(() => new Error(errorMessage)));
    fixture.detectChanges();
    tick();

    expect(component.orders).toEqual([]);
    expect(component.error).toBe('Failed to load orders. Please try again later.');
    expect(orderService.getOrders).toHaveBeenCalled();
  }));

  describe('Template Tests', () => {
    beforeEach(() => {
      orderService.getOrders.and.returnValue(of(mockOrders));
      fixture.detectChanges();
    });

    it('should display orders in a table', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(mockOrders.length);

      const firstRow = rows[0];
      const cells = firstRow.querySelectorAll('td');

      expect(cells[0].textContent).toContain(mockOrders[0].orderNumber);
      expect(cells[1].textContent).toContain(mockOrders[0].description);
      expect(cells[2].textContent).toContain(mockOrders[0].streetAddress);
      expect(cells[3].textContent).toContain(mockOrders[0].town);
      expect(cells[4].textContent).toContain(mockOrders[0].country);
      expect(cells[5].textContent).toContain(mockOrders[0].amount);
      expect(cells[6].textContent).toContain(mockOrders[0].currency);
      expect(cells[7].textContent).toContain(mockOrders[0].paymentDueDate);
    });

    it('should show "No orders found" message when orders array is empty', fakeAsync(() => {
      orderService.getOrders.and.returnValue(of([]));
      component.ngOnInit();
      tick();
      fixture.detectChanges();

      const noOrdersMessage = fixture.nativeElement.querySelector('.no-orders');
      expect(noOrdersMessage).toBeTruthy();
      expect(noOrdersMessage.textContent).toContain('No orders found');
    }));

    it('should show error message when there is an error', () => {
      component.error = 'Test error message';
      fixture.detectChanges();

      const errorMessage = fixture.nativeElement.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent.trim()).toBe('Test error message');
    });

    it('should not show table when there is an error', () => {
      component.error = 'Test error message';
      fixture.detectChanges();

      const table = fixture.nativeElement.querySelector('table');
      expect(table).toBeFalsy();
    });
  });
});
