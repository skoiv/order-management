import { IsNotEmpty, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import Big from 'big.js';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ value }) => new Big(value))
  @Min(0)
  amount: Big;
}
