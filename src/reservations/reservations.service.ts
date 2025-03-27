import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationStatus } from './schemas/reservation.schema';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ClubsService } from '../clubs/clubs.service';
import { TableStatus } from '../clubs/schemas/table.schema';
import * as crypto from 'crypto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<Reservation>,
    private clubsService: ClubsService,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string): Promise<Reservation> {
    // Benzersiz rezervasyon kodu oluştur
    const reservationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    // Kulüp var mı kontrol et
    const club = await this.clubsService.findOne(createReservationDto.clubId);
    if (!club) {
      throw new NotFoundException(`${createReservationDto.clubId} ID'li kulüp bulunamadı`);
    }
    
    // Verilen bir masa ID'si var mı kontrol et
    if (createReservationDto.tableId) {
      const table = await this.clubsService.findTableById(createReservationDto.tableId);
      
      if (table.clubId.toString() !== createReservationDto.clubId) {
        throw new BadRequestException(`Masa, belirtilen kulübe ait değil`);
      }
      
      if (table.status !== TableStatus.AVAILABLE) {
        throw new BadRequestException(`Masa rezervasyon için uygun değil, durumu: ${table.status}`);
      }
      
      // Masa kapasitesini kontrol et
      if (table.capacity < createReservationDto.partySize) {
        throw new BadRequestException(`Masa kapasitesi (${table.capacity}) grup büyüklüğü için yeterli değil (${createReservationDto.partySize})`);
      }
    }
    
    // Yeni rezervasyon oluştur
    const reservationData = {
      ...createReservationDto,
      userId,
      reservationCode,
    };
    
    const newReservation = await this.reservationModel.create(reservationData);
    
    // Eğer bir masa atanmışsa, masanın durumunu güncelle
    if (createReservationDto.tableId) {
      await this.clubsService.updateTableStatus(
        createReservationDto.tableId,
        TableStatus.RESERVED
      );
      
      await this.clubsService.updateTable(createReservationDto.tableId, {
        currentReservationId: newReservation._id ? newReservation._id.toString() : newReservation.id.toString()
      });
    }
    
    return newReservation;
  }

  async findAll(clubId?: string, userId?: string): Promise<Reservation[]> {
    let query = {};
    
    if (clubId) {
      query = { ...query, clubId };
    }
    
    if (userId) {
      query = { ...query, userId };
    }
    
    return this.reservationModel.find(query)
      .sort({ date: 1, time: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id).exec();
    
    if (!reservation) {
      throw new NotFoundException(`${id} ID'li rezervasyon bulunamadı`);
    }
    
    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);
    
    // Mevcut masa ID'si
    const currentTableId = reservation.tableId?.toString();
    // İstek ile gelen masa ID'si
    const newTableId = updateReservationDto.tableId;
    
    // Masa değişimi kontrolü
    if (newTableId && newTableId !== currentTableId) {
      // Yeni masa var mı ve uygun mu kontrol et
      const newTable = await this.clubsService.findTableById(newTableId);
      
      if (newTable.clubId.toString() !== reservation.clubId.toString()) {
        throw new BadRequestException(`Masa, rezervasyonun ait olduğu kulübe ait değil`);
      }
      
      if (newTable.status !== TableStatus.AVAILABLE) {
        throw new BadRequestException(`Masa rezervasyon için uygun değil, durumu: ${newTable.status}`);
      }
      
      // Eğer mevcut bir masa varsa, serbest bırak
      if (currentTableId) {
        await this.clubsService.updateTableStatus(currentTableId, TableStatus.AVAILABLE);
        await this.clubsService.updateTable(currentTableId, { currentReservationId: '' });
      }
      
      // Yeni masayı rezerve et
      await this.clubsService.updateTableStatus(newTableId, TableStatus.RESERVED);
      await this.clubsService.updateTable(newTableId, { currentReservationId: id });
    }
    
    // Rezervasyon durumu değişim kontrolü
    if (updateReservationDto.status && updateReservationDto.status !== reservation.status) {
      // Eğer rezervasyon iptal ediliyor veya tamamlanıyorsa ve bir masa atanmışsa
      if (
        (updateReservationDto.status === ReservationStatus.CANCELLED || 
         updateReservationDto.status === ReservationStatus.COMPLETED ||
         updateReservationDto.status === ReservationStatus.NO_SHOW) && 
        currentTableId
      ) {
        await this.clubsService.updateTableStatus(currentTableId, TableStatus.AVAILABLE);
        await this.clubsService.updateTable(currentTableId, { currentReservationId: '' });
      }
    }
    
    // Rezervasyonu güncelle
    const updatedReservation = await this.reservationModel.findByIdAndUpdate(
      id,
      updateReservationDto,
      { new: true }
    );
    
    if (!updatedReservation) {
      throw new NotFoundException(`${id} ID'li rezervasyon bulunamadı`);
    }
    
    return updatedReservation;
  }

  async updateStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    return this.update(id, { status });
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const reservation = await this.findOne(id);
    
    // Eğer rezervasyona bir masa atanmışsa, serbest bırak
    if (reservation.tableId) {
      await this.clubsService.updateTableStatus(
        reservation.tableId.toString(),
        TableStatus.AVAILABLE
      );
      
      await this.clubsService.updateTable(
        reservation.tableId.toString(),
        { currentReservationId: '' }
      );
    }
    
    const result = await this.reservationModel.deleteOne({ _id: id });
    return { deleted: result.deletedCount > 0 };
  }
} 