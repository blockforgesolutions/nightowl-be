import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Role } from "./interface/role.interface";
import { PrivilegeModel } from "src/privileges/privilege.schema";

export type RoleDocument = Role & Document

@Schema({ timestamps: true })
export class RoleModel extends Document implements Role {
    @Prop({
        required: true,
        unique: true
    })
    name: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'PrivilegeModel' }] })
    privileges: PrivilegeModel[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleModel);