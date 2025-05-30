import { IsNotEmpty, IsString, Matches, IsISO4217CurrencyCode } from 'class-validator';
import { Order } from '../entities/order.entity';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @IsString()
  @IsNotEmpty()
  town: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsISO4217CurrencyCode()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'paymentDueDate must be in YYYY-MM-DD format'
  })
  paymentDueDate: string;

  toEntity(): Order {
    const order = new Order();
    order.orderNumber = this.orderNumber;
    order.description = this.description;
    order.streetAddress = this.streetAddress;
    order.town = this.town;
    order.country = this.country;
    order.amount = this.amount;
    order.currency = this.currency;
    order.paymentDueDate = new Date(this.paymentDueDate);
    return order;
  }
}
