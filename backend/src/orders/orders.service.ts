import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(order: Order): Promise<Order> {
    return this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      order: {
        paymentDueDate: 'ASC',
      },
    });

    console.log('Orders from DB:', orders);
    console.log(
      'First order payment due date type:',
      orders[0]?.paymentDueDate instanceof Date ? 'Date' : typeof orders[0]?.paymentDueDate,
    );
    console.log('First order payment due date value:', orders[0]?.paymentDueDate);

    return orders;
  }
}
