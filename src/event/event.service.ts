import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventModel } from './event.schema';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponse } from './model/event.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { EventMessage } from './enums/event.enum';

@Injectable()
export class EventService {
    constructor(
        @InjectModel(EventModel.name) private readonly eventModel: Model<EventModel>
    ) { }

    async createEvent(event: CreateEventDto): Promise<EventResponse> {
        const newEvent = await this.eventModel.create(event);

        const transformedEvent = transformMongoData(
            (await newEvent.populate('club', 'id name country city district neighborhood street no address zipCode')).toObject(), EventResponse
        );

        return transformedEvent;
    }

    async getEvents(): Promise<EventResponse[]> {
        const events = await this.eventModel.find()
            .populate('club', 'id name country city district neighborhood street no address zipCode')
            .lean();

        const transformedEvents = transformMongoArray<EventModel, EventResponse>(events);

        return transformedEvents;
    }

    async getEvent(eventId: string): Promise<EventResponse> {
        const event = await this.eventModel.findById(eventId)
            .populate('club', 'id name country city district neighborhood street no address zipCode')
            .lean();

        if (!event) {
            throw new HttpException(EventMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedEvent = transformMongoData(event, EventResponse);

        return transformedEvent;
    }

    async addTicketToEvent(ticketId: string, eventId: string): Promise<EventResponse> {
        const event = await this.eventModel.findById(eventId)

        if (!event) {
            throw new HttpException(EventMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const exists = await this.eventModel.findOne({
            _id: eventId,
            tickets: { $in: [ticketId] }
        })

        if (exists) {
            throw new HttpException(EventMessage.TICKET_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
        }

        const updatedEvent = await this.eventModel.findByIdAndUpdate(
            eventId,
            { $push: { tickets: ticketId } },
            { new: true }
        )

        if (!updatedEvent) {
            throw new HttpException(EventMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const transformedRole = transformMongoData(updatedEvent, EventResponse);
        return transformedRole;
    }

    async updateEvent(eventId: string, event: CreateEventDto): Promise<EventResponse> {
        const updatedEvent = await this.eventModel.findByIdAndUpdate(eventId, event, { new: true }).lean();

        if (!updatedEvent) {
            throw new HttpException(EventMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedEvent = transformMongoData(updatedEvent, EventResponse);

        return transformedEvent;
    }

    async deleteEvent(eventId: string): Promise<{ message: string }> {
        const deletedEvent = await this.eventModel.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            throw new HttpException(EventMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return { message: EventMessage.DELETED };
    }
}
