import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Employee } from "./interface/employee.interface";

export type EmployeeDocument = Employee & Document

@Schema({ timestamps: true })
export class EmployeeModel extends Document implements Employee {
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

export const EmployeeSchema = SchemaFactory.createForClass(EmployeeModel)