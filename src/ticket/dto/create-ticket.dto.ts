import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Schema } from "mongoose";

export class CreateTicketDto {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    @IsMongoId()
    @IsNotEmpty()
    readonly userId: Schema.Types.ObjectId

    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    @IsMongoId()
    @IsNotEmpty()
    readonly eventId: Schema.Types.ObjectId

    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    @IsMongoId()
    @IsNotEmpty()
    readonly orderId: Schema.Types.ObjectId

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ' })
    @IsNotEmpty()
    @IsString()
    readonly qrCodeData: string
}