import { 
  IsString, 
  IsNumber, 
  IsEnum, 
  IsOptional, 
  IsMongoId, 
  IsDateString, 
  IsEmail, 
  IsMobilePhone,
  IsNotEmpty,
  Min,
  Max
} from 'class-validator';
import { ReservationStatus } from '../schemas/reservation.schema';

export class CreateReservationDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsNumber()
  @Min(1)
  @Max(30)
  partySize: number;

  @IsMongoId()
  @IsNotEmpty()
  clubId: string;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;

  @IsMongoId()
  @IsOptional()
  tableId?: string;

  @IsString()
  @IsOptional()
  specialRequests?: string;

  @IsMobilePhone()
  @IsOptional()
  contactPhone?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;
} 