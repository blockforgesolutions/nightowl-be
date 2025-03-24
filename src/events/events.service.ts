import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventStatus } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SearchEventsDto } from './dto/search-events.dto';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Tarih kontrolü
    const startDate = new Date(createEventDto.startDate);
    const endDate = new Date(createEventDto.endDate);
    
    if (startDate >= endDate) {
      throw new BadRequestException('Etkinlik bitiş tarihi başlangıç tarihinden sonra olmalıdır');
    }
    
    if (startDate < new Date()) {
      throw new BadRequestException('Etkinlik başlangıç tarihi şu anki tarihten sonra olmalıdır');
    }
    
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel
      .find({ isActive: true })
      .sort({ startDate: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    
    if (!event) {
      throw new NotFoundException(`${id} ID'li etkinlik bulunamadı`);
    }
    
    return event;
  }

  async search(searchDto: SearchEventsDto): Promise<[Event[], number]> {
    let query: any = { isActive: true };
    
    if (searchDto.query) {
      query = { 
        ...query, 
        $or: [
          { name: { $regex: searchDto.query, $options: 'i' } },
          { description: { $regex: searchDto.query, $options: 'i' } }
        ] 
      };
    }
    
    if (searchDto.clubId) {
      query = { ...query, clubId: searchDto.clubId };
    }
    
    if (searchDto.genre) {
      query = { ...query, genre: searchDto.genre };
    }
    
    if (searchDto.status) {
      query = { ...query, status: searchDto.status };
    }
    
    if (searchDto.startDateFrom) {
      query = { 
        ...query, 
        startDate: { 
          ...((query['startDate'] as any) || {}),
          $gte: new Date(searchDto.startDateFrom) 
        } 
      };
    }
    
    if (searchDto.startDateTo) {
      query = { 
        ...query, 
        startDate: { 
          ...((query['startDate'] as any) || {}),
          $lte: new Date(searchDto.startDateTo) 
        } 
      };
    }
    
    if (searchDto.upcomingOnly) {
      query = { 
        ...query, 
        startDate: { 
          ...((query['startDate'] as any) || {}),
          $gt: new Date() 
        } 
      };
    }
    
    const take = searchDto.take || 10;
    const skip = searchDto.skip || 0;
    
    const events = await this.eventModel
      .find(query)
      .populate('club')
      .sort({ startDate: 1 })
      .limit(take)
      .skip(skip)
      .exec();
    
    const total = await this.eventModel.countDocuments(query).exec();
    
    return [events, total];
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string, userRole: UserRole, clubOwnerId: string): Promise<Event> {
    const event = await this.findOne(id);
    
    // Sadece kulüp sahibi veya admin güncelleyebilir
    if (clubOwnerId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Bu etkinliği güncelleme yetkiniz yok');
    }
    
    // Tarih kontrolü
    if (updateEventDto.startDate && updateEventDto.endDate) {
      const startDate = new Date(updateEventDto.startDate);
      const endDate = new Date(updateEventDto.endDate);
      
      if (startDate >= endDate) {
        throw new BadRequestException('Etkinlik bitiş tarihi başlangıç tarihinden sonra olmalıdır');
      }
    } else if (updateEventDto.startDate && !updateEventDto.endDate) {
      const startDate = new Date(updateEventDto.startDate);
      
      if (startDate >= event.endDate) {
        throw new BadRequestException('Etkinlik bitiş tarihi başlangıç tarihinden sonra olmalıdır');
      }
    } else if (!updateEventDto.startDate && updateEventDto.endDate) {
      const endDate = new Date(updateEventDto.endDate);
      
      if (event.startDate >= endDate) {
        throw new BadRequestException('Etkinlik bitiş tarihi başlangıç tarihinden sonra olmalıdır');
      }
    }
    
    Object.assign(event, updateEventDto);
    return event.save();
  }

  async remove(id: string, userId: string, userRole: UserRole, clubOwnerId: string): Promise<void> {
    const event = await this.findOne(id);
    
    // Sadece kulüp sahibi veya admin silebilir
    if (clubOwnerId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Bu etkinliği silme yetkiniz yok');
    }
    
    await this.eventModel.findByIdAndDelete(id).exec();
  }

  async updateStatus(): Promise<void> {
    const now = new Date();
    
    // Başlangıç tarihi geçmiş ama bitiş tarihi gelmemiş olanları ONGOING yapma
    await this.eventModel.updateMany(
      { 
        startDate: { $lte: now },
        endDate: { $gte: now },
        status: EventStatus.UPCOMING 
      },
      { $set: { status: EventStatus.ONGOING } }
    ).exec();
    
    // Bitiş tarihi geçmiş olanları COMPLETED yapma
    await this.eventModel.updateMany(
      { 
        endDate: { $lte: now },
        status: EventStatus.ONGOING 
      },
      { $set: { status: EventStatus.COMPLETED } }
    ).exec();
  }
} 