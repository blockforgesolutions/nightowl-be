import { ApiProperty } from "@nestjs/swagger";
import { PermissionAction } from "src/common/enums/permission.enum";

class Privileges {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    id: string

    @ApiProperty({ example: 'Read' })
    name: string

    @ApiProperty({ example: ' Read the data ' })
    description: string

    @ApiProperty({ example: 'Read' })
    action: PermissionAction
}

export class RoleResponse {
    @ApiProperty({ example: '67ec0cdc464f9688663f1700' })
    id: string

    @ApiProperty({ example: 'Admin' })
    name: string

    @ApiProperty({ type: [Privileges] })
    privileges: Privileges[]
}