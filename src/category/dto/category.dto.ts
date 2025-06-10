import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CategoryDto {
    @ApiProperty({example:'Drinks'})
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({example:'white'})
    @IsString()
    @IsOptional()
    color: string

    @ApiProperty({example:'67ec0cdc464f9688663f1700'})
    @IsString()
    @IsNotEmpty()
    club: Types.ObjectId
}