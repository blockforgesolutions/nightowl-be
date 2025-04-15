import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose'
import { Category } from "./interface/category.interface";

export type CategoryDocument = Category & Document

@Schema({ timestamps: true })
export class CategoryModel extends Document implements Category {
    @Prop({ required: true })
    title: string;

    @Prop({ default: 'white' })
    color: string;

    @Prop({
        required:true,
        ref:'CompanyModel',
    })
    club: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryModel)