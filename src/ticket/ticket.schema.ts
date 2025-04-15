// schemas/ticket.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class TicketModel extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserModel', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'EventModel', required: true })
  eventId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'OrderModel', required: true })
  orderId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true }) 
  qrCodeData: string;

  @Prop({ default: false })
  used: boolean;

  @Prop()
  checkInTime: Date;
}

export const TicketSchema = SchemaFactory.createForClass(TicketModel);
