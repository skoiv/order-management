import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  private async checkDuplicateOrderNumber(orderNumber: string): Promise<void> {
    const existingOrder = await this.ordersRepository.findOne({
      where: { orderNumber },
    });
    if (existingOrder) {
      throw new ConflictException(`Order number ${orderNumber} already exists`);
    }
  }

  async create(order: Order): Promise<Order> {
    await this.checkDuplicateOrderNumber(order.orderNumber);
    return this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      order: {
        paymentDueDate: 'ASC',
      },
    });
  }
}
