import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose'
import { Role } from "./interface/role.interface";

export type RoleDocument = Role & Document

@Schema({ timestamps: true })
export class RoleModel extends Document implements Role {
    @Prop({
        required: true,
        unique: true
    })
    name: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'PrivilegeModel' }] })
    privileges: Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleModel);