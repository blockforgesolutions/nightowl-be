import { ApiProperty } from "@nestjs/swagger";
export class UpdateEventDto {
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
}