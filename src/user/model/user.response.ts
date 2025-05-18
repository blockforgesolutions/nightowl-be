import { ApiProperty } from "@nestjs/swagger";

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

export class UserResponse {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    id: string

    @ApiProperty({ example: 'John Doe' })
    fullName: string

    @ApiProperty({ example: '2HtJp@example.com' })
    email: string

    @ApiProperty({ example: '+90 555 555 55 55' })
    phoneNumber: string

    @ApiProperty({ example: 'USER' })
    role: string

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

    @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
    lastEntry: Date

    @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
    lastExit: Date

    // @ApiProperty({example:'2022-01-01T00:00:00.000Z'})
    // createdAt: Date

    // @ApiProperty({example:'2022-01-01T00:00:00.000Z'})
    // updatedAt: Date
}