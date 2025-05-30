import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import Big from 'big.js';

@Injectable()
export class OrderMapper {
  toEntity(dto: CreateOrderDto): Order {
    const entity = new Order();
    entity.orderNumber = dto.orderNumber;
    entity.description = dto.description;
    entity.streetAddress = dto.streetAddress;
    entity.town = dto.town;
    entity.country = dto.country;
    entity.amount = new Big(dto.amount);
    entity.currency = dto.currency;
    entity.paymentDueDate = new Date(dto.paymentDueDate);
    return entity;
  }

  toDto(entity: Order): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = entity.id;
    dto.orderNumber = entity.orderNumber;
    dto.description = entity.description;
    dto.streetAddress = entity.streetAddress;
    dto.town = entity.town;
    dto.country = entity.country;
    dto.amount = entity.amount.toFixed(2);
    dto.currency = entity.currency;
    dto.paymentDueDate = entity.paymentDueDate.toLocaleDateString('en-CA');
    return dto;
  }
}
