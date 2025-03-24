import { IsNotEmpty, IsUUID, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { TicketStatus } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;
} 