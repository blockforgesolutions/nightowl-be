import { ApiProperty } from "@nestjs/swagger"

class User {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    readonly id: string

    @ApiProperty({ example: 'John Doe' })
    readonly fullName: string

    @ApiProperty({ example: 'johndoe@gmail.com' })
    readonly email: string

}

class Event {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    readonly id: string

    @ApiProperty({ example: 'Event Title' })
    readonly title: string

    @ApiProperty({ example: "Event Description" })
    description: string;

    @ApiProperty({ example: "2022-01-01T00:00:00.000Z" })
    date: Date;

    @ApiProperty({ example: "Event Location" })
    location: string;

    @ApiProperty({ example: 150 })
    capacity: number;

    @ApiProperty({ example: 150.00 })
    price: number;
}

export class TicketResponse {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    readonly id: string

    @ApiProperty({ type: User })
    readonly user: User 

    @ApiProperty({ type: Event })
    readonly event: Event

    @ApiProperty({ example: 'TmljQGolbnonKDpYZUNFLjRLRyQ0VT9WalRvJVhPNHdnQUcnXVpySkJpanRyJGI=' })
    readonly sessionId: string

    @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAAEkCAYAAACG+UzsAAAAAklEQVR4AewaftIAABSeSURBVO3BQW7s2pLAQFL' })
    readonly qrCodeData: string

    @ApiProperty({ example: false })
    readonly used: boolean

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
    readonly checkInTime: Date
}