import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Schema } from "mongoose";

export class ItemDto {
    @ApiProperty({ example: "67ec0cdc464f9688663f1700" })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    productId: Schema.Types.ObjectId

    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsNotEmpty()
    quantity: number
}