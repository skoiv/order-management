import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp, closeTestApp } from './test-setup';
import { DataSource } from 'typeorm';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const baseCreateOrderDto = {
    orderNumber: 'ORD-001',
    description: 'Test order',
    streetAddress: '123 Test St',
    town: 'Test Town',
    country: 'Estonia',
    amount: '100.50',
    currency: 'EUR',
    paymentDueDate: '2024-12-31',
  };

  const uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const orderMatcher = {
    id: expect.stringMatching(uuidV4Pattern),
    orderNumber: baseCreateOrderDto.orderNumber,
    description: baseCreateOrderDto.description,
    streetAddress: baseCreateOrderDto.streetAddress,
    town: baseCreateOrderDto.town,
    country: baseCreateOrderDto.country,
    amount: baseCreateOrderDto.amount,
    currency: baseCreateOrderDto.currency,
    paymentDueDate: '2024-12-31',
  };

  beforeAll(async () => {
    app = await createTestApp();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await dataSource.createQueryRunner().query('TRUNCATE TABLE "order" RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('POST /api/orders', () => {
    it('should create a new order with valid date format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/orders')
        .send(baseCreateOrderDto)
        .expect(201);

      expect(response.body).toMatchObject(orderMatcher);
    });

    it('should reject invalid payment due date format', async () => {
      const invalidDateDto = {
        ...baseCreateOrderDto,
        paymentDueDate: '2024-12-31T23:59:59Z',
      };

      const response = await request(app.getHttpServer())
        .post('/api/orders')
        .send(invalidDateDto)
        .expect(400);

      expect(response.body.message).toContain('paymentDueDate must be in YYYY-MM-DD format');
    });

    it('should reject duplicate order number', async () => {
      await request(app.getHttpServer()).post('/api/orders').send(baseCreateOrderDto).expect(201);

      const response = await request(app.getHttpServer())
        .post('/api/orders')
        .send(baseCreateOrderDto)
        .expect(409);

      expect(response.body.message).toBe(
        `Order number ${baseCreateOrderDto.orderNumber} already exists`,
      );
    });
  });

  describe('GET /api/orders', () => {
    it('should return all orders with valid UUID', async () => {
      await request(app.getHttpServer()).post('/api/orders').send(baseCreateOrderDto).expect(201);

      const response = await request(app.getHttpServer()).get('/api/orders').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toMatchObject(orderMatcher);
    });
  });
});
