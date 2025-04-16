import { Schema } from "mongoose"

export interface Privilege {
    name: string,
    description: string
    action: string
    createdBy: Schema.Types.ObjectId
}