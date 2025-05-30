import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDatabase } from './test-database';
import { OrdersModule } from '../src/orders/orders.module';

export async function createTestingModule(): Promise<TestingModule> {
  await TestDatabase.start();
  const dataSource = TestDatabase.getDataSource();

  return Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        ...dataSource.options,
      }),
      OrdersModule,
    ],
  }).compile();
}

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture = await createTestingModule();
  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}

export async function closeTestApp(app: INestApplication) {
  await app.close();
  await TestDatabase.stop();
}
