import { ApiProperty } from "@nestjs/swagger"
import { Schema } from "mongoose"

export class TicketResponse {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    readonly id: string

    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    readonly userId: Schema.Types.ObjectId

    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    readonly eventId: Schema.Types.ObjectId

    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    readonly orderId: Schema.Types.ObjectId

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ' })
    readonly qrCodeData: string

    @ApiProperty({ example: false })
    readonly used: boolean

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
    readonly checkInTime: Date
}