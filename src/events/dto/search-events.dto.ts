import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MusicGenre } from '../../clubs/entities/club.entity';
import { EventStatus } from '../entities/event.entity';

export class SearchEventsDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  clubId?: string;

  @IsEnum(MusicGenre)
  @IsOptional()
  genre?: MusicGenre;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @IsDateString()
  @IsOptional()
  startDateFrom?: string;

  @IsDateString()
  @IsOptional()
  startDateTo?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  upcomingOnly?: boolean;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  take?: number = 10;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  skip?: number = 0;
} 