import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

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
  })
  amount: string;

  @Column()
  currency: string;

  @Column({ type: 'date' })
  paymentDueDate: Date;
}
