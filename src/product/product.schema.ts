import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Product } from "./interface/product";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class ProductModel extends Document implements Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    unit: string;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'CategoryModel' })
    category: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'ClubModel' })
    club: MongooseSchema.Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);