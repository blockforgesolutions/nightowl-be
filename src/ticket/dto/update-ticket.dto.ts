import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty } from "class-validator";

export class UpdateTicketDto {
    @ApiProperty({ example: true })
    @IsBoolean()
    @IsNotEmpty()
    used: boolean

    @ApiProperty({ example : '2025-01-01T00:00:00.000Z' })
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    date: Date
}