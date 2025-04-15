import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TicketModel } from './ticket.schema';
import { Model } from 'mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketResponse } from './model/ticket.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { TicketMessage } from './enums/ticket.enum';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
    constructor(
        @InjectModel(TicketModel.name) private readonly ticketModel: Model<TicketModel>,
    ) { }

    async createTicket(ticket: CreateTicketDto): Promise<TicketResponse> {
        const newTicket = await this.ticketModel.create(ticket);

        const transformedTicket = transformMongoData(newTicket.toObject(), TicketResponse);

        return transformedTicket;
    }

    async getTicketById(ticketId: string): Promise<TicketResponse> {
        const ticket = await this.ticketModel.findById(ticketId);

        if (!ticket) {
            throw new HttpException(TicketMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedTicket = transformMongoData(ticket, TicketResponse);

        return transformedTicket;
    }

    async updateTicket(ticketId: string, ticket: UpdateTicketDto): Promise<TicketResponse> {
        const updatedTicket = await this.ticketModel.findByIdAndUpdate(ticketId, ticket, { new: true }).lean();

        if (!updatedTicket) {
            throw new HttpException(TicketMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedTicket = transformMongoData(updatedTicket, TicketResponse);

        return transformedTicket;
    }

    async deleteTicket(ticketId: string): Promise<{ message: string }> {
        const deletedTicket = await this.ticketModel.findByIdAndDelete(ticketId);

        if (!deletedTicket) {
            throw new HttpException(TicketMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return { message: TicketMessage.DELETED };
    }
}
