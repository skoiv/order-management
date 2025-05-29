import { Controller, Get, Logger } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  @Get()
  findAll() {
    this.logger.log('GET /orders - Fetching all orders');
    return [];
  }
}
