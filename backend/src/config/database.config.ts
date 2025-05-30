import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'order_management',
  entities: [Order],
  synchronize: process.env.NODE_ENV !== 'production',
};
