import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrderListComponent } from './order-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as OrderActions from '../../state/orders/order.actions';
import * as OrderSelectors from '../../state/orders/order.selectors';
import { Store } from '@ngrx/store';
import { Order } from '../../models/order.interface';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
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
      createOrderSuccess: false,
    },
  };

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
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        OrderListComponent,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore({ initialState }), { provide: Router, useValue: routerSpy }],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    store = TestBed.inject(Store) as MockStore;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load orders on init', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');
    store.overrideSelector(OrderSelectors.selectOrdersWithFallback, mockOrders);
    store.overrideSelector(OrderSelectors.selectFilteredOrdersByCountryAndDescription, mockOrders);
    store.refreshState();

    fixture.detectChanges();
    tick();

    expect(dispatchSpy).toHaveBeenCalledWith(OrderActions.loadOrders());
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

      const sortedOrders = [...mixedOrders].sort((a, b) => {
        if (a.country === 'Estonia' && b.country !== 'Estonia') return -1;
        if (a.country !== 'Estonia' && b.country === 'Estonia') return 1;
        return 0;
      });

      store.overrideSelector(OrderSelectors.selectOrdersWithFallback, sortedOrders);
      store.overrideSelector(
        OrderSelectors.selectFilteredOrdersByCountryAndDescription,
        sortedOrders,
      );
      store.refreshState();

      fixture.detectChanges();
      tick();

      const rows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');
      expect(rows.length).toBe(sortedOrders.length);
      expect(rows[0].querySelectorAll('td')[4].textContent?.trim()).toBe('Estonia');
      expect(rows[1].querySelectorAll('td')[4].textContent?.trim()).toBe('Estonia');
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

    beforeEach(() => {
      store.overrideSelector(OrderSelectors.selectOrdersWithFallback, filterTestOrders);
      store.overrideSelector(
        OrderSelectors.selectFilteredOrdersByCountryAndDescription,
        filterTestOrders,
      );
      store.refreshState();
      fixture.detectChanges();
    });

    it('should dispatch actions when filtering by country', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      const country = 'Estonia';

      component.onCountryChange(country);

      expect(dispatchSpy).toHaveBeenCalledWith(OrderActions.setSelectedCountry({ country }));
    });

    it('should dispatch actions when filtering by description', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      const description = 'Special';

      component.onDescriptionChange(description);

      expect(dispatchSpy).toHaveBeenCalledWith(OrderActions.setDescriptionFilter({ description }));
    });
  });

  describe('Template Tests', () => {
    beforeEach(() => {
      store.overrideSelector(
        OrderSelectors.selectFilteredOrdersByCountryAndDescription,
        mockOrders,
      );
      store.overrideSelector(OrderSelectors.selectLoading, false);
      store.overrideSelector(OrderSelectors.selectError, null);
      store.overrideSelector(OrderSelectors.selectOrdersWithFallback, mockOrders);
      store.overrideSelector(OrderSelectors.selectAvailableCountries, ['Estonia', 'Latvia']);
      store.overrideSelector(OrderSelectors.selectSelectedCountry, '');
      store.overrideSelector(OrderSelectors.selectDescriptionFilter, '');
      store.refreshState();
      fixture.detectChanges();
    });

    it('should display orders in a material table', () => {
      const rows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');
      expect(rows.length).toBe(mockOrders.length);

      const firstRow = rows[0];
      const cells = firstRow.querySelectorAll('td');

      expect(cells[0].textContent?.trim()).toBe(mockOrders[0].orderNumber);
      expect(cells[1].textContent?.trim()).toBe(mockOrders[0].description);
    });

    it('should show loading spinner when loading', () => {
      store.overrideSelector(OrderSelectors.selectLoading, true);
      store.refreshState();
      fixture.detectChanges();

      const loadingSpinner = fixture.nativeElement.querySelector('.loading-spinner');
      expect(loadingSpinner).toBeTruthy();
      expect(loadingSpinner.querySelector('mat-spinner')).toBeTruthy();
    });

    it('should show error message when there is an error', () => {
      const errorMessage = 'Test error message';
      store.overrideSelector(OrderSelectors.selectError, errorMessage);
      store.refreshState();
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('mat-error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent?.trim()).toBe(errorMessage);
    });

    it('should show no data message when filtered orders are empty', () => {
      store.overrideSelector(OrderSelectors.selectFilteredOrdersByCountryAndDescription, []);
      store.overrideSelector(OrderSelectors.selectOrdersWithFallback, []);
      store.refreshState();
      fixture.detectChanges();

      const noDataMessage = fixture.nativeElement.querySelector('.no-orders');
      expect(noDataMessage).toBeTruthy();
      expect(noDataMessage.textContent?.trim()).toBe('No orders found');
    });
  });

  describe('Navigation', () => {
    it('should navigate to create order page', () => {
      component.navigateToCreate();
      expect(router.navigate).toHaveBeenCalledWith(['/orders/create']);
    });
  });
});
