import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class UpdateClubDto {
    @ApiProperty({ example: "Club Name" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: "10:00" })
    @IsString()
    @IsNotEmpty()
    dayStart: string;

    @ApiProperty({ example: "23:59" })
    @IsString()
    @IsNotEmpty()
    dayEnd: string;

    @ApiProperty({ example: "Sound 1" })
    @IsString()
    @IsOptional()
    notificationSound?: string;

    @ApiProperty({ example: "localhost:8081" })
    @IsString()
    @IsOptional()
    socketAddress?: string;

    @ApiProperty({ example: 10 })
    @IsNumber()
    @IsNotEmpty()
    screenLockTime: number;

    @ApiProperty({ example: 10 })
    @IsNumber()
    @IsNotEmpty()
    changeTableTime: number;

    @ApiProperty({ example: "Turkey" })
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty({ example: "Istanbul" })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: "Beylikduzu" })
    @IsString()
    @IsNotEmpty()
    district: string;

    @ApiProperty({ example: "Beylikduzu" })
    @IsString()
    @IsNotEmpty()
    neighborhood: string;

    @ApiProperty({ example: "Beylikduzu" })
    @IsString()
    @IsNotEmpty()
    street: string;

    @ApiProperty({ example: "15B" })
    @IsString()
    @IsNotEmpty()
    no: string;

    @ApiProperty({ example: "long address" })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ example: "12345" })
    @IsString()
    @IsNotEmpty()
    zipCode: string;
}
