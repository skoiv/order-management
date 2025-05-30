import { Order } from '../entities/order.entity';

export class OrderResponseDto {
  id: number;
  orderNumber: string;
  description: string;
  amount: string;

  static fromEntity(order: Order): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = order.id;
    dto.orderNumber = order.orderNumber;
    dto.description = order.description;
    dto.amount = order.amount.toString();
    return dto;
  }
} 