import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { CreateTableDto } from './create-table.dto';

export class UpdateTableDto extends PartialType(CreateTableDto) {
  @IsString()
  @IsOptional()
  currentReservationId?: string;

  @IsString()
  @IsOptional()
  currentOrderId?: string;
} 