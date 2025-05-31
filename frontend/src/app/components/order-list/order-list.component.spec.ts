import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrderListComponent } from './order-list.component';
import { OrderService } from '../../services/order.service';
import { of, throwError } from 'rxjs';
import { Order } from '../../models/order.interface';
import { FormsModule } from '@angular/forms';

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
      imports: [OrderListComponent, FormsModule],
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
    expect(component.filteredOrders).toEqual(mockOrders);
    expect(component.error).toBeNull();
    expect(orderService.getOrders).toHaveBeenCalled();
  }));

  it('should handle error when loading orders fails', fakeAsync(() => {
    const errorMessage = 'Failed to fetch orders';
    orderService.getOrders.and.returnValue(throwError(() => new Error(errorMessage)));
    fixture.detectChanges();
    tick();

    expect(component.orders).toEqual([]);
    expect(component.filteredOrders).toEqual([]);
    expect(component.error).toBe('Failed to load orders. Please try again later.');
    expect(orderService.getOrders).toHaveBeenCalled();
  }));

  describe('Order Sorting', () => {
    it('should show Estonia orders first', fakeAsync(() => {
      const mixedOrders: Order[] = [
        {
          orderNumber: 'ORD-001',
          description: 'Latvia Order',
          streetAddress: '123 Test St',
          town: 'Riga',
          country: 'Latvia',
          amount: '100.00',
          currency: 'EUR',
          paymentDueDate: '2024-12-31',
        },
        {
          orderNumber: 'ORD-002',
          description: 'Estonia Order 1',
          streetAddress: '456 Test Ave',
          town: 'Tallinn',
          country: 'Estonia',
          amount: '200.00',
          currency: 'EUR',
          paymentDueDate: '2024-11-30',
        },
        {
          orderNumber: 'ORD-003',
          description: 'Lithuania Order',
          streetAddress: '789 Test Rd',
          town: 'Vilnius',
          country: 'Lithuania',
          amount: '300.00',
          currency: 'EUR',
          paymentDueDate: '2024-10-31',
        },
        {
          orderNumber: 'ORD-004',
          description: 'Estonia Order 2',
          streetAddress: '321 Test Blvd',
          town: 'Tartu',
          country: 'Estonia',
          amount: '400.00',
          currency: 'EUR',
          paymentDueDate: '2024-09-30',
        },
      ];

      orderService.getOrders.and.returnValue(of(mixedOrders));
      fixture.detectChanges();
      tick();

      // Verify that Estonia orders are first
      expect(component.orders[0].country).toBe('Estonia');
      expect(component.orders[1].country).toBe('Estonia');
      expect(component.orders.filter(order => order.country === 'Estonia').length).toBe(2);
    }));
  });

  describe('Filtering', () => {
    const filterTestOrders: Order[] = [
      {
        orderNumber: 'ORD-001',
        description: 'Special Order',
        streetAddress: '123 Test St',
        town: 'Tallinn',
        country: 'Estonia',
        amount: '100.00',
        currency: 'EUR',
        paymentDueDate: '2024-12-31',
      },
      {
        orderNumber: 'ORD-002',
        description: 'Regular Order',
        streetAddress: '456 Test Ave',
        town: 'Riga',
        country: 'Latvia',
        amount: '200.00',
        currency: 'EUR',
        paymentDueDate: '2024-11-30',
      },
      {
        orderNumber: 'ORD-003',
        description: 'Normal Delivery',
        streetAddress: '789 Test Rd',
        town: 'Tartu',
        country: 'Estonia',
        amount: '300.00',
        currency: 'EUR',
        paymentDueDate: '2024-10-31',
      },
    ];

    beforeEach(fakeAsync(() => {
      orderService.getOrders.and.returnValue(of(filterTestOrders));
      fixture.detectChanges();
      tick();
    }));

    it('should initialize with all available countries', () => {
      expect(component.availableCountries).toEqual(['Estonia', 'Latvia']);
    });

    it('should filter by country', () => {
      component.selectedCountry = 'Estonia';
      component.onCountryChange();

      expect(component.filteredOrders.length).toBe(2);
      expect(component.filteredOrders.every(order => order.country === 'Estonia')).toBe(true);
    });

    it('should filter by description', () => {
      component.descriptionFilter = 'Special';
      component.onDescriptionChange();

      expect(component.filteredOrders.length).toBe(1);
      expect(
        component.filteredOrders.every(order =>
          order.description.toLowerCase().includes('special'),
        ),
      ).toBe(true);
    });

    it('should combine country and description filters', () => {
      component.selectedCountry = 'Estonia';
      component.descriptionFilter = 'Special';
      component.applyFilters();

      expect(component.filteredOrders.length).toBe(1);
      expect(component.filteredOrders[0].country).toBe('Estonia');
      expect(component.filteredOrders[0].description).toContain('Special');
    });

    it('should show all orders when filters are cleared', () => {
      // First apply filters
      component.selectedCountry = 'Estonia';
      component.descriptionFilter = 'Special';
      component.applyFilters();

      // Then clear filters
      component.selectedCountry = '';
      component.descriptionFilter = '';
      component.applyFilters();

      expect(component.filteredOrders.length).toBe(filterTestOrders.length);
    });
  });

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

    it('should show "No orders match the selected filters" when filtered results are empty', fakeAsync(() => {
      // Set a filter that will return no results
      component.descriptionFilter = 'NonexistentDescription';
      component.onDescriptionChange();
      fixture.detectChanges();

      const noOrdersMessage = fixture.nativeElement.querySelector('.no-orders');
      expect(noOrdersMessage).toBeTruthy();
      expect(noOrdersMessage.textContent).toContain('No orders match the selected filters');
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

    it('should render filter controls', () => {
      const countrySelect = fixture.nativeElement.querySelector('#countryFilter');
      const descriptionInput = fixture.nativeElement.querySelector('#descriptionFilter');

      expect(countrySelect).toBeTruthy();
      expect(descriptionInput).toBeTruthy();
    });
  });
});
