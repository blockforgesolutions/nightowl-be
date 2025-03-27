import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MusicGenre } from '../schemas/club.schema';

class OpeningHoursDto {
  @IsString()
  @IsOptional()
  monday?: string;

  @IsString()
  @IsOptional()
  tuesday?: string;

  @IsString()
  @IsOptional()
  wednesday?: string;

  @IsString()
  @IsOptional()
  thursday?: string;

  @IsString()
  @IsOptional()
  friday?: string;

  @IsString()
  @IsOptional()
  saturday?: string;

  @IsString()
  @IsOptional()
  sunday?: string;
}

export class UpdateClubDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  @IsEnum(MusicGenre)
  @IsOptional()
  primaryGenre?: MusicGenre;

  @IsArray()
  @IsEnum(MusicGenre, { each: true })
  @IsOptional()
  genres?: MusicGenre[];

  @ValidateNested()
  @Type(() => OpeningHoursDto)
  @IsOptional()
  openingHours?: OpeningHoursDto;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];
}