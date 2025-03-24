import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { TableStatus, TableType } from '../schemas/table.schema';

export class CreateTableDto {
  @IsString()
  tableNumber: string;

  @IsNumber()
  @Min(1)
  @Max(50)
  capacity: number;

  @IsEnum(TableStatus)
  @IsOptional()
  status?: TableStatus;

  @IsEnum(TableType)
  @IsOptional()
  type?: TableType;

  @IsString()
  @IsOptional()
  locationDescription?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 