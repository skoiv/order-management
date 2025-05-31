import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import Big from 'big.js';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @Column()
  description: string;

  @Column()
  streetAddress: string;

  @Column()
  town: string;

  @Column()
  country: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      from: (value: string) => (value ? new Big(value) : null),
      to: (value: Big) => (value ? value.toString() : null),
    },
  })
  amount: Big;

  @Column()
  currency: string;

  @Column({
    type: 'date',
    transformer: {
      from: (value: string) => (value ? new Date(value) : null),
      to: (value: Date) => value,
    },
  })
  paymentDueDate: Date;
}
