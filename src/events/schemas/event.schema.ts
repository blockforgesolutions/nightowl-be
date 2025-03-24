import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Club, MusicGenre } from '../../clubs/schemas/club.schema';

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({ type: Number, default: 0 })
  ticketPrice: number;

  @Prop()
  coverImageUrl: string;

  @Prop({ 
    type: String, 
    enum: MusicGenre, 
    default: MusicGenre.POP 
  })
  genre: MusicGenre;

  @Prop({ 
    type: String, 
    enum: EventStatus, 
    default: EventStatus.UPCOMING 
  })
  status: EventStatus;

  @Prop({ type: Number, default: 0 })
  totalTickets: number;

  @Prop({ type: Number, default: 0 })
  soldTickets: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club', required: true })
  clubId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club' })
  club: Club;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event); 