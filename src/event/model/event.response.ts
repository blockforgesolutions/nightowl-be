import { ApiProperty } from "@nestjs/swagger";
import { Schema } from "mongoose";

class Club {
    @ApiProperty({ example: "67ec0cdc464f9688663f1700" })
    id: string;

    @ApiProperty({ example: "Club Name" })
    name: string;

    @ApiProperty({ example: 'Turkey' })
    country: string

    @ApiProperty({ example: 'Istanbul' })
    city: string

    @ApiProperty({ example: 'Beylikduzu' })
    district: string

    @ApiProperty({ example: 'Beylikduzu' })
    neighborhood: string

    @ApiProperty({ example: 'Beylikduzu' })
    street: string

    @ApiProperty({ example: 'Beylikduzu' })
    no: string

    @ApiProperty({ example: 'Long address' })
    address: string

    @ApiProperty({ example: '12345' })
    zipCode: string
}

export class EventResponse {
    @ApiProperty({ example: "67ec0cdc464f9688663f1700" })
    id: string;

    @ApiProperty({ example: "Event Name" })
    title: string;

    @ApiProperty({ example: "Event Description" })
    description: string;

    @ApiProperty({ example: "2022-01-01T00:00:00.000Z" })
    date: Date;

    @ApiProperty({ example: "Event Location" })
    location: string;

    @ApiProperty({ example: 150 })
    capacity: number;

    @ApiProperty({
        type: Club, 
        example: {
            id: "67ec0cdc464f9688663f1700",
            name: "Club Name",
            country: "Turkey",
            city: "Istanbul",
            district: "Beylikduzu",
            neighborhood: "Beylikduzu",
            street: "Beylikduzu",
            no: "Beylikduzu",
            address: "Long address",
            zipCode: "12345"
        }
    })
    club: Club;

    @ApiProperty({ example: 0 })
    ticketsSold: number

    @ApiProperty({ example: ["67ec0cdc464f9688663f1700"] })
    tickets: Schema.Types.ObjectId[]
}