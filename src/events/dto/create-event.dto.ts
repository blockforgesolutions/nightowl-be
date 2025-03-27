import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsDateString, Min, IsMongoId } from 'class-validator';
import { MusicGenre } from '../../clubs/schemas/club.schema';
import { EventStatus } from '../schemas/event.schema';

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

  @IsMongoId()
  clubId: string;
} 