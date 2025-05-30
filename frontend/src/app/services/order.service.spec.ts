import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { Order } from '../models/order.interface';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const mockOrder: Order = {
    orderNumber: 'ORD-001',
    description: 'Test Order',
    streetAddress: '123 Test St',
    town: 'Test Town',
    country: 'Test Country',
    amount: '100.00',
    currency: 'EUR',
    paymentDueDate: '2024-12-31',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderService, provideHttpClient(withFetch()), provideHttpClientTesting()],
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createOrder', () => {
    it('should send POST request with order data', () => {
      service.createOrder(mockOrder).subscribe(order => {
        expect(order).toEqual(mockOrder);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/orders');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockOrder);
      req.flush(mockOrder);
    });

    it('should handle error response', () => {
      const errorMessage = 'Failed to create order';

      service.createOrder(mockOrder).subscribe({
        error: error => {
          expect(error.error).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/orders');
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });
});
