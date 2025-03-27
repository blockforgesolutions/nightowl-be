import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min, IsBoolean } from 'class-validator';
import { MusicGenre } from '../../clubs/schemas/club.schema';
import { EventStatus } from '../schemas/event.schema';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  ticketPrice?: number;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsEnum(MusicGenre)
  @IsOptional()
  genre?: MusicGenre;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalTickets?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}