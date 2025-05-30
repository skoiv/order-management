import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import { Order } from '../src/orders/entities/order.entity';

export class TestDatabase {
  private static container: StartedPostgreSqlContainer;
  private static dataSource: DataSource;

  static async start() {
    this.container = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('order_management_test')
      .withUsername('postgres')
      .withPassword('postgres')
      .start();

    this.dataSource = new DataSource({
      type: 'postgres',
      host: this.container.getHost(),
      port: this.container.getMappedPort(5432),
      username: this.container.getUsername(),
      password: this.container.getPassword(),
      database: this.container.getDatabase(),
      entities: [Order],
      synchronize: true,
    });

    await this.dataSource.initialize();
  }

  static async stop() {
    if (this.dataSource) {
      await this.dataSource.destroy();
    }
    if (this.container) {
      await this.container.stop();
    }
  }

  static getDataSource() {
    return this.dataSource;
  }
} 