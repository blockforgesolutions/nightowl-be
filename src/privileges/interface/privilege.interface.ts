import { Schema } from "mongoose"
import { PermissionAction } from "../../common/enums/permission.enum"

export interface Privilege {
    name: string,
    description: string
    action: PermissionAction
    createdBy: Schema.Types.ObjectId
}