import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { Order } from '../models/order.interface';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
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

  it('should create an order', () => {
    const mockOrder: Order = {
      orderNumber: 'ORD-001',
      description: 'Test Order',
      amount: '100.00'
    };

    service.createOrder(mockOrder).subscribe(order => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/orders');
    expect(req.request.method).toBe('POST');
    req.flush(mockOrder);
  });
}); 