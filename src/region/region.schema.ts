import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Region } from "./interface/region.interface";

export type RegionDocument = Region & Document

@Schema({ timestamps: true })
export class RegionModel extends Document implements Region {
    @Prop({ required: true })
    name: string;

    @Prop({
        ref: 'ClubModel',
        type: MongooseSchema.Types.ObjectId,
        required: true
    })
    club: MongooseSchema.Types.ObjectId;
}

export const RegionSchema = SchemaFactory.createForClass(RegionModel)