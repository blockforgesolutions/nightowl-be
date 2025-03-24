import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Event } from '../../events/schemas/event.schema';

export enum TicketStatus {
  RESERVED = 'reserved',
  PAID = 'paid',
  USED = 'used',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class Ticket extends Document {
  @Prop({ required: true, unique: true })
  ticketCode: string;

  @Prop({ 
    type: String, 
    enum: TicketStatus, 
    default: TicketStatus.RESERVED 
  })
  status: TicketStatus;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop()
  paymentIntentId: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ default: false })
  isUsed: boolean;

  @Prop({ type: Date })
  usedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  eventId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event' })
  event: Event;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket); 