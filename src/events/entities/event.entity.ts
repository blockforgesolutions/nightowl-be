import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';
import { MusicGenre } from '../../clubs/entities/club.entity';

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  ticketPrice: number;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column({
    type: 'enum',
    enum: MusicGenre,
    default: MusicGenre.POP,
  })
  genre: MusicGenre;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.UPCOMING,
  })
  status: EventStatus;

  @Column({ type: 'int', default: 0 })
  totalTickets: number;

  @Column({ type: 'int', default: 0 })
  soldTickets: number;

  @ManyToOne(() => Club, { eager: true })
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @Column()
  clubId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 