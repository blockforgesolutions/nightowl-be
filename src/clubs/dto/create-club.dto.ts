import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { MusicGenre } from '../entities/club.entity';

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

export class CreateClubDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  capacity: number;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  @IsEnum(MusicGenre)
  primaryGenre: MusicGenre;

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