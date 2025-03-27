import { IsOptional, IsEnum, IsBoolean, IsString, IsDate } from 'class-validator';
import { TicketStatus } from '../schemas/ticket.schema';
import { Type } from 'class-transformer';

export class UpdateTicketDto {
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsBoolean()
  @IsOptional()
  isUsed?: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  usedAt?: Date;

  @IsString()
  @IsOptional()
  paymentIntentId?: string;
} 