import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';
import { OrderItem } from './order-item.entity';

export enum ProductCategory {
  FOOD = 'food',
  DRINK = 'drink',
  DESSERT = 'dessert',
  SPECIAL = 'special',
  OTHER = 'other',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({
    type: 'enum',
    enum: ProductCategory,
    default: ProductCategory.OTHER,
  })
  category: ProductCategory;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Club, club => club.products)
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @Column()
  clubId: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 