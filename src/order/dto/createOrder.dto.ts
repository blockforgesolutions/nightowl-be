import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { ItemDto } from "./item.dto";
import { ApiProperty } from "@nestjs/swagger";



export class CreateOrderDto {
    @ApiProperty({ example: "67ec0cdc464f9688663f1700" })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    regionId: Types.ObjectId

    @ApiProperty({ example: "67ec0cdc464f9688663f1700" })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    tableId: Types.ObjectId

    @ApiProperty({ type: [ItemDto] })
    @IsArray()
    @IsNotEmpty()
    items: ItemDto[]
}