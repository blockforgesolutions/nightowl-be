import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Schema } from "mongoose";

export class CreateRegionDto {
    @ApiProperty({ example: "Region Name" })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({ example: "67ec0cdc464f9688663f1700" })
    @IsMongoId()
    @IsNotEmpty()
    company: Schema.Types.ObjectId
}