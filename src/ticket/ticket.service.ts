import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TicketModel } from './ticket.schema';
import { Model } from 'mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketResponse } from './model/ticket.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { TicketMessage } from './enums/ticket.enum';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { QrCodeService } from 'src/qr-code/qr-code.service';
import { JwtService } from '@nestjs/jwt';
import { CommonMessage } from 'src/common/enums/response/common-message.enum';
import { VerifyTicketResponse } from './model/verify-ticket.response';
import { EventService } from 'src/event/event.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TicketService {
    constructor(
        @InjectModel(TicketModel.name) private readonly ticketModel: Model<TicketModel>,
        private readonly qrCodeService: QrCodeService,
        private readonly eventService: EventService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async createTicket(ticket: CreateTicketDto): Promise<TicketResponse> {
        const isExists = await this.ticketModel.findOne({ sessionId: ticket.sessionId });

        if (isExists) {
            throw new HttpException(TicketMessage.ALREADY_EXISTS, HttpStatus.BAD_REQUEST)
        }

        const newTicket = new this.ticketModel(ticket);

        const qrPayload = {
            userId: ticket.user,
            eventId: ticket.event,
            sessionId: ticket.sessionId,
            expDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24
        };

        const qrCodeData = await this.qrCodeService.generateQR(qrPayload);

        newTicket.qrCodeData = qrCodeData.qr;
        newTicket.qrToken = qrCodeData.qrToken;
        await newTicket.save();

        const transformedTicket = transformMongoData(newTicket.toObject(), TicketResponse);

        return transformedTicket;
    }

    async getTicketById(ticketId: string): Promise<TicketResponse> {
        const ticket = await this.ticketModel.findById(ticketId)
            .populate([
                { path: 'user', select: 'id fullName email' },
                { path: 'event', select: 'id name description date location capacity price' },
            ])
            .lean();

        if (!ticket) {
            throw new HttpException(TicketMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedTicket = transformMongoData(ticket, TicketResponse);

        return transformedTicket;
    }

    async getTicketBySession(sessionId: string): Promise<TicketResponse> {
        const ticket = await this.ticketModel.findOne({ sessionId })
            .populate([
                { path: 'user', select: 'id fullName email' },
                { path: 'event', select: 'id name description date location capacity price' },
            ])
            .lean();

        if (!ticket) {
            throw new HttpException(TicketMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedTicket = transformMongoData(ticket, TicketResponse);

        return transformedTicket;
    }

    async verifyTicket(token: string): Promise<VerifyTicketResponse> {
        const decoded = this.jwtService.decode(token);

        if (!decoded) {
            throw new HttpException(CommonMessage.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST)
        }

        const ticket = await this.ticketModel.findOne({ sessionId: decoded.sessionId }).lean()

        if (!ticket) {
            throw new HttpException(TicketMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        if (ticket.used) {
            throw new HttpException(TicketMessage.ALREADY_USED, HttpStatus.BAD_REQUEST)
        }

        const user = await this.userService.getUserById(String(ticket.user));
        const event = await this.eventService.getEvent(String(ticket.event));

        return {
            valid:true,
            user,
            event,
            ticket: {
                ...ticket,
                id: ticket._id.toString()
            }
        }
    }

    async updateTicket(ticketId: string, ticket: UpdateTicketDto): Promise<TicketResponse> {
        const updatedTicket = await this.ticketModel.findByIdAndUpdate(ticketId, ticket, { new: true })
            .populate([
                { path: 'user', select: 'id fullName email' },
                { path: 'event', select: 'id name description date location capacity price' },
            ])
            .lean();

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
