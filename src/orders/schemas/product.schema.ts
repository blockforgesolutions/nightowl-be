import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Club } from '../../clubs/schemas/club.schema';
import { OrderItem } from './order-item.schema';

export enum ProductCategory {
  FOOD = 'food',
  DRINK = 'drink',
  DESSERT = 'dessert',
  SPECIAL = 'special',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ 
    type: String, 
    enum: ProductCategory, 
    default: ProductCategory.OTHER 
  })
  category: ProductCategory;

  @Prop()
  imageUrl: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club', required: true })
  clubId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club' })
  club: Club;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'OrderItem' }] })
  orderItems: OrderItem[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product); 