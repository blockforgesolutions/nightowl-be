import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { Schema } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example:'John Doe'})
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({example:'2HtJp@example.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({example:'password'})
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({example:'+905555555555'})
    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({example:'d67ec0cdc464f9688663f1700'})
    @IsNotEmpty()
    @IsString()
    role?: Schema.Types.ObjectId;

    @ApiProperty({example:'d67ec0cdc464f9688663f1700'})
    @IsString()
    @IsNotEmpty()
    club?: Schema.Types.ObjectId;
}