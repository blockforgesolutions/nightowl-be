import { IsString, IsOptional, IsEnum, IsArray, IsNumber, Min, Max } from 'class-validator';
import { MusicGenre } from '../schemas/club.schema';
import { Type } from 'class-transformer';

export class SearchClubsDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsEnum(MusicGenre)
  @IsOptional()
  genre?: MusicGenre;

  @IsArray()
  @IsEnum(MusicGenre, { each: true })
  @IsOptional()
  genres?: MusicGenre[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minRating?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  maxRating?: number;

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