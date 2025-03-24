import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, MusicGenre } from './schemas/club.schema';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { SearchClubsDto } from './dto/search-clubs.dto';
import { UserRole } from '../users/schemas/user.schema';
import { Table, TableStatus } from './schemas/table.schema';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class ClubsService {
  constructor(
    @InjectModel(Club.name)
    private clubModel: Model<Club>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
  ) {}

  async create(createClubDto: CreateClubDto, userId: string): Promise<Club> {
    // DTO'daki OpeningHoursDto'yu Record<string, string> türüne dönüştür
    const openingHoursRecord = createClubDto.openingHours 
      ? Object.entries(createClubDto.openingHours).reduce(
          (acc, [key, value]) => {
            if (value) acc[key] = value;
            return acc;
          }, 
          {} as Record<string, string>
        ) 
      : undefined;

    const createdClub = new this.clubModel({
      ...createClubDto,
      openingHours: openingHoursRecord,
      ownerId: userId,
    });
    
    return createdClub.save();
  }

  async findAll(): Promise<Club[]> {
    return this.clubModel
      .find({ isActive: true })
      .sort({ rating: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Club> {
    const club = await this.clubModel.findById(id).exec();
    
    if (!club) {
      throw new NotFoundException(`${id} ID'li kulüp bulunamadı`);
    }
    
    return club;
  }

  async search(searchDto: SearchClubsDto): Promise<[Club[], number]> {
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
    
    if (searchDto.city) {
      query = { 
        ...query, 
        city: { $regex: searchDto.city, $options: 'i' } 
      };
    }
    
    if (searchDto.genre) {
      query = { 
        ...query, 
        primaryGenre: searchDto.genre 
      };
    }
    
    if (searchDto.genres && searchDto.genres.length > 0) {
      query = { 
        ...query, 
        genres: { $in: searchDto.genres } 
      };
    }
    
    if (searchDto.minRating !== undefined) {
      query = { 
        ...query, 
        rating: { $gte: searchDto.minRating } 
      };
    }
    
    if (searchDto.maxRating !== undefined) {
      query = { 
        ...query, 
        rating: { ...(query['rating'] || {}), $lte: searchDto.maxRating } 
      };
    }
    
    const take = searchDto.take || 10;
    const skip = searchDto.skip || 0;
    
    const clubs = await this.clubModel
      .find(query)
      .populate('owner')
      .sort({ rating: -1 })
      .limit(take)
      .skip(skip)
      .exec();
    
    const total = await this.clubModel.countDocuments(query).exec();
    
    return [clubs, total];
  }

  async update(id: string, updateClubDto: UpdateClubDto, userId: string, userRole: UserRole): Promise<Club> {
    const club = await this.findOne(id);
    
    // Sadece kulüp sahibi veya admin güncelleyebilir
    if (club.ownerId.toString() !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Bu kulübü güncelleme yetkiniz yok');
    }
    
    // OpeningHours için dönüşüm
    if (updateClubDto.openingHours) {
      const openingHoursRecord = Object.entries(updateClubDto.openingHours).reduce(
        (acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        }, 
        {} as Record<string, string>
      );
      updateClubDto.openingHours = openingHoursRecord;
    }
    
    Object.assign(club, updateClubDto);
    return club.save();
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const club = await this.findOne(id);
    
    // Sadece kulüp sahibi veya admin silebilir
    if (club.ownerId.toString() !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Bu kulübü silme yetkiniz yok');
    }
    
    await this.clubModel.findByIdAndDelete(id).exec();
  }

  // Masa yönetimi metotları
  async createTable(clubId: string, createTableDto: CreateTableDto): Promise<Table> {
    const club = await this.clubModel.findById(clubId);
    if (!club) {
      throw new NotFoundException(`Kulüp ID'si ${clubId} ile bulunamadı`);
    }

    // Aynı masa numarasının daha önce kullanılıp kullanılmadığını kontrol et
    const existingTable = await this.tableModel.findOne({ 
      clubId: clubId, 
      tableNumber: createTableDto.tableNumber 
    });
    
    if (existingTable) {
      throw new BadRequestException(`${createTableDto.tableNumber} numaralı masa zaten mevcut`);
    }

    const newTable = new this.tableModel({
      ...createTableDto,
      clubId: clubId,
    });

    return newTable.save();
  }

  async findAllTables(clubId: string): Promise<Table[]> {
    return this.tableModel.find({ clubId }).exec();
  }

  async findAvailableTables(clubId: string): Promise<Table[]> {
    return this.tableModel.find({ 
      clubId, 
      status: TableStatus.AVAILABLE,
      isActive: true 
    }).exec();
  }

  async findTableById(tableId: string): Promise<Table> {
    const table = await this.tableModel.findById(tableId);
    
    if (!table) {
      throw new NotFoundException(`${tableId} ID'li masa bulunamadı`);
    }
    
    return table;
  }

  async updateTable(tableId: string, updateTableDto: UpdateTableDto): Promise<Table> {
    const table = await this.tableModel.findByIdAndUpdate(
      tableId,
      updateTableDto,
      { new: true }
    );

    if (!table) {
      throw new NotFoundException(`${tableId} ID'li masa bulunamadı`);
    }

    return table;
  }

  async updateTableStatus(tableId: string, status: TableStatus): Promise<Table> {
    const table = await this.tableModel.findByIdAndUpdate(
      tableId,
      { status },
      { new: true }
    );

    if (!table) {
      throw new NotFoundException(`${tableId} ID'li masa bulunamadı`);
    }

    return table;
  }

  async assignOrderToTable(tableId: string, orderId: string): Promise<Table> {
    const table = await this.tableModel.findByIdAndUpdate(
      tableId,
      { 
        currentOrderId: orderId,
        status: TableStatus.OCCUPIED 
      },
      { new: true }
    );

    if (!table) {
      throw new NotFoundException(`${tableId} ID'li masa bulunamadı`);
    }

    return table;
  }

  async removeOrderFromTable(tableId: string): Promise<Table> {
    const table = await this.tableModel.findById(tableId);
    
    if (!table) {
      throw new NotFoundException(`${tableId} ID'li masa bulunamadı`);
    }

    // Masa hala rezerve edilmiş ise, sipariş kaldırıldıktan sonra rezerve durumuna geri dön
    const newStatus = table.currentReservationId 
      ? TableStatus.RESERVED 
      : TableStatus.AVAILABLE;

    return this.tableModel.findByIdAndUpdate(
      tableId,
      { 
        currentOrderId: null,
        status: newStatus 
      },
      { new: true }
    );
  }

  async deleteTable(tableId: string): Promise<{ deleted: boolean }> {
    const result = await this.tableModel.deleteOne({ _id: tableId });
    return { deleted: result.deletedCount > 0 };
  }
} 