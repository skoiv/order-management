import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp, closeTestApp } from './test-setup';
import Big from 'big.js';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {   
    await closeTestApp(app);
  });

  describe('POST /orders', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        orderNumber: 'ORD-001',
        description: 'Test order',
        amount: new Big('100.50'),
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(201);

      expect(response.body).toMatchObject({
        orderNumber: createOrderDto.orderNumber,
        description: createOrderDto.description,
        amount: createOrderDto.amount.toString(),
      });
    });
  });
});
