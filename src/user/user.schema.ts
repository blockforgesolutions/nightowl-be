import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose'
import { User } from "./interface/user.interface";

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class UserModel extends Document implements User {
    @Prop({
        required: true
    })
    fullName: string;

    @Prop({
        required: true
    })
    email: string;

    @Prop({
        required: true
    })
    password: string;

    @Prop({
        required: true
    })
    phoneNumber: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId, 
        ref: "RoleModel", 
        required: true
    })
    role: MongooseSchema.Types.ObjectId;

    @Prop()
    lastEntry?: Date;
    
    @Prop()
    lastExit?: Date;

    @Prop({
        ref:'ClubModel',
        required: true
    })
    club: MongooseSchema.Types.ObjectId
}

export const UserSchema = SchemaFactory.createForClass(UserModel)