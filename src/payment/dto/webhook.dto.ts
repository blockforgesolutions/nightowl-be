import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Schema } from "mongoose";


export class WebhookDto {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    @IsMongoId()
    @IsNotEmpty()
    readonly userId: Schema.Types.ObjectId

    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    @IsMongoId()
    @IsNotEmpty()
    readonly eventId: Schema.Types.ObjectId

    @ApiProperty({ example: "TmljQGolbnonKDpYZUNFLjRLRyQ0VT9WalRvJVhPNHdnQUcnXVpySkJpanRyJGI=" })
    @IsNotEmpty()
    @IsString()
    readonly sessionId: string

}