import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({example:'2HtJp@example.com'})
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({example:'password'})
    @IsString()
    @IsNotEmpty()
    password: string
}