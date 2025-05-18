import { ApiProperty } from "@nestjs/swagger";
import { Schema } from "mongoose";

export class ProductResponse {
    @ApiProperty({example:'67ec0cdc464f9688663f1700'})
    id:string

    @ApiProperty({example:'Product Name'})
    name:string

    @ApiProperty({example:'10.00'})
    price:number

    @ApiProperty({example:'Unit'})
    unit:string

    @ApiProperty({example:'67ec0cdc464f9688663f1700'})
    category: Schema.Types.ObjectId

    @ApiProperty({example:'67ec0cdc464f9688663f1700'})
    company: Schema.Types.ObjectId
}