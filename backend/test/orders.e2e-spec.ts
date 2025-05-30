import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp, closeTestApp } from './test-setup';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {   
    await closeTestApp(app);
  });

  describe('POST /api/orders', () => {
    it('should create a new order with valid date format', async () => {
      const createOrderDto = {
        orderNumber: 'ORD-001',
        description: 'Test order',
        streetAddress: '123 Test St',
        town: 'Test Town',
        country: 'Estonia',
        amount: '100.50',
        currency: 'EUR',
        paymentDueDate: '2024-12-31',
      };

      const response = await request(app.getHttpServer())
        .post('/api/orders')
        .send(createOrderDto)
        .expect(201);

      expect(response.body).toMatchObject({
        orderNumber: createOrderDto.orderNumber,
        description: createOrderDto.description,
        streetAddress: createOrderDto.streetAddress,
        town: createOrderDto.town,
        country: createOrderDto.country,
        amount: createOrderDto.amount,
        currency: createOrderDto.currency,
        paymentDueDate: '2024-12-31',
      });
    });

    it('should reject invalid date format', async () => {
      const createOrderDto = {
        orderNumber: 'ORD-002',
        description: 'Test order',
        streetAddress: '123 Test St',
        town: 'Test Town',
        country: 'Estonia',
        amount: '100.50',
        currency: 'EUR',
        paymentDueDate: '2024-12-31T23:59:59Z', // Invalid format
      };

      const response = await request(app.getHttpServer())
        .post('/api/orders')
        .send(createOrderDto)
        .expect(400);

      expect(response.body.message).toContain('paymentDueDate must be in YYYY-MM-DD format');
    });
  });
});
