import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Schema } from "mongoose";

export class CreateTicketDto {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    @IsMongoId()
    @IsNotEmpty()
    readonly user: Schema.Types.ObjectId

    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    @IsMongoId()
    @IsNotEmpty()
    readonly event: Schema.Types.ObjectId

    @ApiProperty({ example: '67ec0cdc464f9688663f1700TmljQGolbnonKDpYZUNFLjRLRyQ0VT9WalRvJVhPNHdnQUcnXVpySkJpanRyJGI=' })
    @IsString()
    @IsNotEmpty()
    sessionId: string

    // @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ' })
    // @IsNotEmpty()
    // @IsString()
    // readonly qrCodeData: string
}