import { ApiProperty } from "@nestjs/swagger";

export class UserResponse {
    @ApiProperty({example:'67ec0cdc464f9688663f1700'})
    id:string

    @ApiProperty({example:'John Doe'})
    fullName:string

    @ApiProperty({example:'2HtJp@example.com'})
    email:string

    @ApiProperty({example:'+90 555 555 55 55'})
    phoneNumber:string

    @ApiProperty({example:'USER'})
    role:string

    @ApiProperty({example:'67ec0cdc464f9688663f1700'})
    club: string

    @ApiProperty({example:'2022-01-01T00:00:00.000Z'})
    lastEntry: Date

    @ApiProperty({example:'2022-01-01T00:00:00.000Z'})
    lastExit: Date

    // @ApiProperty({example:'2022-01-01T00:00:00.000Z'})
    // createdAt: Date

    // @ApiProperty({example:'2022-01-01T00:00:00.000Z'})
    // updatedAt: Date
}