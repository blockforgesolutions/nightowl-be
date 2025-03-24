import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Order } from './order.schema';
import { Product } from './product.schema';

@Schema()
export class OrderItem extends Document {
  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true })
  orderId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order' })
  order: Order;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop({ required: true })
  productName: string;

  @Prop()
  notes: string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem); 