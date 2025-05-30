import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp, closeTestApp } from './test-setup';
import { DataSource } from 'typeorm';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await createTestApp();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    // Clean up the database before each test
    await dataSource.createQueryRunner().query('TRUNCATE TABLE "order" RESTART IDENTITY CASCADE');
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

  describe('GET /api/orders', () => {
    it('should return all orders', async () => {
      // First create a test order with a unique orderNumber
      const createOrderDto = {
        orderNumber: 'ORD-GET-TEST-001', // Changed to be unique
        description: 'Test order',
        streetAddress: '123 Test St',
        town: 'Test Town',
        country: 'Estonia',
        amount: '100.50',
        currency: 'EUR',
        paymentDueDate: '2024-12-31',
      };

      // Create the order first
      await request(app.getHttpServer()).post('/api/orders').send(createOrderDto).expect(201);

      // Then test getting all orders
      const response = await request(app.getHttpServer()).get('/api/orders').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toMatchObject({
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
  });
});
