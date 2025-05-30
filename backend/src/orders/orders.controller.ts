import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderMapper } from './order.mapper';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderMapper: OrderMapper,
  ) {}

  @Get()
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findAll();
    return orders.map((order) => this.orderMapper.toDto(order));
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const orderEntity = this.orderMapper.toEntity(createOrderDto);
    const savedOrder = await this.ordersService.create(orderEntity);
    return this.orderMapper.toDto(savedOrder);
  }
}
