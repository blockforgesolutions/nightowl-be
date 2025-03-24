import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyTicketDto {
  @IsString()
  @IsNotEmpty()
  ticketCode: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;
} 