import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Order, PaymentType } from "./interface/order.interface";

export type OrderDocument = Order & Document;

@Schema({ timestamps: true, _id: false })
class Items {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'ProductModel' })
    productId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    quantity: number;
}

@Schema({ timestamps: true})
export class OrderModel extends Document implements Order {

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'RegionModel' })
    regionId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'TableModel' })
    tableId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, type: [Items] })
    items: Items[];

    @Prop({ required: true, default: 'pending' })
    status: string;

    @Prop({ required: false })
    totalAmount: number;

    @Prop({ required: false })
    paymentType: PaymentType;
}

export const OrderSchema = SchemaFactory.createForClass(OrderModel)