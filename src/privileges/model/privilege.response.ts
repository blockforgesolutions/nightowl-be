import { ApiProperty } from "@nestjs/swagger";
import { PermissionAction } from "../../common/enums/permission.enum";

class Club {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    id:string

    @ApiProperty({ example: 'Club Name' })
    name:string
}

class CreatedBy {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    id:string

    @ApiProperty({ example: 'John Doe' })
    fullName:string

    @ApiProperty({type: Club})
    club: Club
}

export class PrivilegeResponse {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    id: string

    @ApiProperty({ example: 'Read' })
    name: string

    @ApiProperty({ example: ' Read the data ' })
    description: string

    @ApiProperty({ example: PermissionAction.CREATE })
    action: PermissionAction

    @ApiProperty({ type: CreatedBy })
    createdBy: CreatedBy
}