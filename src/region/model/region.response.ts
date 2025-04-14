import { ApiProperty } from "@nestjs/swagger";
import { Schema } from "mongoose";

export class RegionResponse {
    @ApiProperty({example:'67ec0cdc464f9688663f1700'})
    id:string

    @ApiProperty({example:'Region Name'})
    name:string

    @ApiProperty({example:'67ec0cdc464f9688663f1700'})
    company: Schema.Types.ObjectId
}