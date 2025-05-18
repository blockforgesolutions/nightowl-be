import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Privilege } from "./interface/privilege.interface";

export type PrivilegeDocument = Privilege & Document

@Schema({ timestamps: true })
export class PrivilegeModel extends Document implements Privilege {
    @Prop({
        required: true,
        unique:true
    })
    name: string;

    @Prop({
        required: true,
    })
    description: string;

    @Prop({ required: true  })
    action: string;

    @Prop({ required: true, ref:'EmployeeModel'})
    createdBy: MongooseSchema.Types.ObjectId;
}

export const PrivilegeSchema = SchemaFactory.createForClass(PrivilegeModel);