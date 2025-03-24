import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../orders/entities/product.entity';

export enum MusicGenre {
  POP = 'pop',
  ROCK = 'rock',
  ELECTRONIC = 'electronic',
  HIP_HOP = 'hip_hop',
  RNB = 'rnb',
  LATIN = 'latin',
  JAZZ = 'jazz',
  CLASSICAL = 'classical',
  OTHER = 'other',
}

@Entity('clubs')
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column('text', { array: true, default: '{}' })
  photos: string[];

  @Column({
    type: 'enum',
    enum: MusicGenre,
    default: MusicGenre.POP,
  })
  primaryGenre: MusicGenre;

  @Column('enum', { enum: MusicGenre, array: true, default: '{}' })
  genres: MusicGenre[];

  @Column({ type: 'jsonb', nullable: true })
  openingHours: Record<string, string>;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  amenities: string[];

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @OneToMany(() => Order, order => order.club)
  orders: Order[];

  @OneToMany(() => Product, product => product.club)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 