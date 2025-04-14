import { ApiProperty } from "@nestjs/swagger";
import { PermissionAction } from "../../common/enums/permission.enum";
import { IsEnum, IsNotEmpty,  IsString } from "class-validator";

export class PrivilegeDto {
    @ApiProperty({ example: 'Read' })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: ' Read the data '})
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty({ enum: PermissionAction, enumName: 'PermissionAction', })
    @IsString()
    @IsNotEmpty()
    @IsEnum(PermissionAction)
    action: PermissionAction

}