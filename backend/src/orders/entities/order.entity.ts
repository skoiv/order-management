import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import Big from 'big.js';
import { BigTransformer } from './big.transformer';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNumber: string;

  @Column()
  description: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: new BigTransformer(),
  })
  amount: Big;
}
