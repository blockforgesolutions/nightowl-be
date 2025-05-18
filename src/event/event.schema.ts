import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Event } from "./interface/event.interface";

export type EventDocument = Event & Document

@Schema({ timestamps: true })
export class EventModel extends Document implements Event {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    capacity: number;
    
    @Prop({ required: true })
    price: number;

    @Prop({ default: 0 })
    ticketsSold: number;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'ClubModel' })
    club: MongooseSchema.Types.ObjectId;

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'TicketModel', default:[] })
    tickets: MongooseSchema.Types.ObjectId[];

}

export const EventSchema = SchemaFactory.createForClass(EventModel)