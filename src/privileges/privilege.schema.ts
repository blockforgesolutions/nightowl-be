import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Privilege } from "./interface/privilege.interface";
import { PermissionAction } from "../common/enums/permission.enum";

export type PrivilegeDocument = Privilege & Document

@Schema({ timestamps: true })
export class PrivilegeModel extends Document implements Privilege {
    @Prop({
        required: true,
    })
    name: string;

    @Prop({
        required: true,
    })
    description: string;

    @Prop({ required: true, enum: PermissionAction })
    action: PermissionAction;

    @Prop({ required: true, ref:'UserModel'})
    createdBy: MongooseSchema.Types.ObjectId;
}

export const PrivilegeSchema = SchemaFactory.createForClass(PrivilegeModel);