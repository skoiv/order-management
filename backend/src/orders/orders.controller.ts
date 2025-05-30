import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return [];
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = await this.ordersService.create(createOrderDto);
    return OrderResponseDto.fromEntity(order);
  }
}
