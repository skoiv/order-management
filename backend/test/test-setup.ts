import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

export async function createTestingModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [],
  }).compile();
}

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture = await createTestingModule();
  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}
