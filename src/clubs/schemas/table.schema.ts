import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Club } from './club.schema';

export enum TableStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
  UNAVAILABLE = 'unavailable',
}

export enum TableType {
  STANDARD = 'standard',
  VIP = 'vip',
  BOOTH = 'booth',
  BAR = 'bar',
}

@Schema({ timestamps: true })
export class Table extends Document {
  @Prop({ required: true })
  tableNumber: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ 
    type: String, 
    enum: TableStatus, 
    default: TableStatus.AVAILABLE 
  })
  status: TableStatus;

  @Prop({ 
    type: String, 
    enum: TableType, 
    default: TableType.STANDARD 
  })
  type: TableType;

  @Prop({ default: null })
  currentReservationId: string;

  @Prop({ default: null })
  currentOrderId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club', required: true })
  clubId: MongooseSchema.Types.ObjectId;

  @Prop({ default: null })
  locationDescription: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TableSchema = SchemaFactory.createForClass(Table); 