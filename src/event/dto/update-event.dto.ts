import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
export class UpdateEventDto {
    @ApiProperty({ example: "Event Name" })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: "Event Description" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: "2022-01-01T00:00:00.000Z" })
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    date: Date;

    @ApiProperty({ example: "Event Location" })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({ example: 150.00 })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({ example: 150 })
    @IsNumber()
    @IsNotEmpty()
    capacity: number;
}