import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Order } from '../../orders/schemas/order.schema';
import { Product } from '../../orders/schemas/product.schema';

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

@Schema({ timestamps: true })
export class Club extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true, type: Number })
  latitude: number;

  @Prop({ required: true, type: Number })
  longitude: number;

  @Prop({ required: true, type: Number })
  capacity: number;

  @Prop()
  coverImageUrl: string;

  @Prop({ type: [String], default: [] })
  photos: string[];

  @Prop({
    type: String,
    enum: MusicGenre,
    default: MusicGenre.POP,
  })
  primaryGenre: MusicGenre;

  @Prop({ type: [String], enum: MusicGenre, default: [] })
  genres: MusicGenre[];

  @Prop({ type: Object })
  openingHours: Record<string, string>;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ type: Number, default: 0 })
  rating: number;

  @Prop({ type: Number, default: 0 })
  ratingCount: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Order' }] })
  orders: Order[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  products: Product[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ClubSchema = SchemaFactory.createForClass(Club); 