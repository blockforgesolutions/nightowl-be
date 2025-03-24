import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketStatus } from './schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { VerifyTicketDto } from './dto/verify-ticket.dto';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private ticketModel: Model<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    // Benzersiz bilet kodu oluştur
    const ticketCode = crypto.randomBytes(8).toString('hex');
    
    const createdTicket = new this.ticketModel({
      ...createTicketDto,
      ticketCode,
    });
    
    return createdTicket.save();
  }

  async findAll(userId?: string): Promise<Ticket[]> {
    if (userId) {
      return this.ticketModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .exec();
    }
    
    return this.ticketModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByEvent(eventId: string): Promise<Ticket[]> {
    return this.ticketModel
      .find({ eventId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(id).exec();
    
    if (!ticket) {
      throw new NotFoundException(`${id} ID'li bilet bulunamadı`);
    }
    
    return ticket;
  }

  async findByCode(ticketCode: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findOne({ ticketCode }).exec();
    
    if (!ticket) {
      throw new NotFoundException(`${ticketCode} kodlu bilet bulunamadı`);
    }
    
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);
    
    // Bilet zaten kullanılmışsa güncellemeye izin verme
    if (ticket.isUsed && updateTicketDto.status === TicketStatus.USED) {
      throw new ConflictException('Bu bilet zaten kullanılmış');
    }
    
    // Kullanıldı olarak işaretlendiyse, kullanılma zamanını ekle
    if (updateTicketDto.isUsed && !ticket.isUsed) {
      updateTicketDto.usedAt = new Date();
    }
    
    Object.assign(ticket, updateTicketDto);
    return ticket.save();
  }

  async verifyTicket(verifyTicketDto: VerifyTicketDto): Promise<{ valid: boolean; message: string; ticket?: Ticket }> {
    try {
      const ticket = await this.findByCode(verifyTicketDto.ticketCode);
      
      // Bilet verilen etkinlik için mi?
      if (ticket.eventId.toString() !== verifyTicketDto.eventId) {
        return {
          valid: false,
          message: 'Bu bilet başka bir etkinlik için',
        };
      }
      
      // Bilet ödenmiş mi?
      if (!ticket.isPaid) {
        return {
          valid: false,
          message: 'Bu bilet henüz ödenmemiş',
        };
      }
      
      // Bilet zaten kullanılmış mı?
      if (ticket.isUsed) {
        return {
          valid: false,
          message: 'Bu bilet zaten kullanılmış',
          ticket,
        };
      }
      
      // Geçerli durum
      return {
        valid: true,
        message: 'Bilet geçerli',
        ticket,
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Bilet bulunamadı veya geçersiz',
      };
    }
  }

  async markAsUsed(id: string): Promise<Ticket> {
    return this.update(id, {
      status: TicketStatus.USED,
      isUsed: true,
      usedAt: new Date(),
    });
  }

  async generateQRCode(ticketCode: string): Promise<string> {
    try {
      return await QRCode.toDataURL(ticketCode);
    } catch (error) {
      throw new BadRequestException('QR kod oluşturulamadı');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.ticketModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`${id} ID'li bilet bulunamadı`);
    }
  }
}