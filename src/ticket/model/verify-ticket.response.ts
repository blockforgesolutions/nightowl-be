import { ApiProperty } from "@nestjs/swagger"
import { Schema } from "mongoose"
import { EventResponse } from "src/event/model/event.response"
import { UserResponse } from "src/user/model/user.response"


export class TicketResponseWithoutUserAndEvent {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    readonly id: string

    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    readonly user: Schema.Types.ObjectId

    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    readonly event: Schema.Types.ObjectId

    @ApiProperty({ example: 'TmljQGolbnonKDpYZUNFLjRLRyQ0VT9WalRvJVhPNHdnQUcnXVpySkJpanRyJGI=' })
    readonly sessionId: string

    @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAAEkCAYAAACG+UzsAAAAAklEQVR4AewaftIAABSeSURBVO3BQW7s2pLAQFL' })
    readonly qrCodeData: string

    @ApiProperty({ example: false })
    readonly used: boolean

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
    readonly checkInTime: Date
}

export class VerifyTicketResponse {
    @ApiProperty({ example: true })
    valid: boolean
    @ApiProperty({ type: UserResponse })
    user: UserResponse;
    @ApiProperty({ type: EventResponse })
    event: EventResponse
    @ApiProperty({ type: TicketResponseWithoutUserAndEvent })
    ticket: TicketResponseWithoutUserAndEvent

}