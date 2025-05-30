import { Order } from '../entities/order.entity';

export class OrderResponseDto {
  id: number;
  orderNumber: string;
  description: string;
  streetAddress: string;
  town: string;
  country: string;
  amount: string;
  currency: string;
  paymentDueDate: string;

  static fromEntity(order: Order): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = order.id;
    dto.orderNumber = order.orderNumber;
    dto.description = order.description;
    dto.streetAddress = order.streetAddress;
    dto.town = order.town;
    dto.country = order.country;
    dto.amount = order.amount.toString();
    dto.currency = order.currency;
    dto.paymentDueDate = order.paymentDueDate.toLocaleDateString('en-CA');
    return dto;
  }
}
