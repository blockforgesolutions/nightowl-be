import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";


export class CategoryRespone {
    @ApiProperty({example:'67ec0cdc464f9688663f1700'})
    id:string

    @ApiProperty({example:'Drinks'})
    title:string

    @ApiProperty({example:'white'})
    color:string

    @ApiProperty({example:'67ec0cdc464f9688663f1700'})
    club: Types.ObjectId
}