import { ApiProperty } from "@nestjs/swagger";

export class ClubResponse {
    @ApiProperty({example:'67ec0cdc464f9688663f1700'})
    id:string

    @ApiProperty({example:'Club Name'})
    name:string

    @ApiProperty({example:'10:00'})
    dayStart:string

    @ApiProperty({example:'23:59'})
    dayEnd:string

    @ApiProperty({example:'Sound 1'})
    notificationSound:string

    @ApiProperty({example:'localhost:8081'})
    socketAddress:string

    @ApiProperty({example:'10'})
    screenLockTime:number

    @ApiProperty({example:'10'})
    changeTableTime:number

    @ApiProperty({example:'Turkey'})
    country:string

    @ApiProperty({example:'Istanbul'})
    city:string

    @ApiProperty({example:'Beylikduzu'})
    district:string

    @ApiProperty({example:'Beylikduzu'})
    neighborhood:string

    @ApiProperty({example:'Beylikduzu'})
    street:string

    @ApiProperty({example:'Beylikduzu'})
    no:string

    @ApiProperty({example:'Long address'})
    address:string

    @ApiProperty({example:'12345'})
    zipCode:string
}