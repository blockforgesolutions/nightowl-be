import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsUUID, IsDateString, Min } from 'class-validator';
import { MusicGenre } from '../../clubs/entities/club.entity';
import { EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @Min(0)
  ticketPrice: number;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsEnum(MusicGenre)
  genre: MusicGenre;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @IsNumber()
  @Min(0)
  totalTickets: number;

  @IsUUID()
  clubId: string;
} 