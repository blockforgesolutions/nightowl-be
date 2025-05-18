import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Schema } from "mongoose";

export class RoleDto {
    @ApiProperty({example:'Role Name'})
    @IsString()
    @IsNotEmpty()
    name:string

    @ApiProperty({example:['67ec0cdc464f9688663f1700']})
    @IsArray()
    @IsOptional()
    privileges: Schema.Types.ObjectId[]
}