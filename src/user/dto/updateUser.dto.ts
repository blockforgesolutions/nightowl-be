import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Schema } from "mongoose";

export class UpdateUserDto  {
    @ApiProperty({example:'John Doe'})
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({example:'2HtJp@example.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({example:'+905555555555'})
    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({example:'d67ec0cdc464f9688663f1700'})
    @IsNotEmpty()
    @IsString()
    role: Schema.Types.ObjectId;

    @IsDate()
    @IsOptional()
    lastEntry?: Date;

    @IsDate()
    @IsOptional()
    lastExit?: Date;

    @ApiProperty({example:'d67ec0cdc464f9688663f1700'})
    @IsString()
    @IsNotEmpty()
    club: Schema.Types.ObjectId;
}