import { Types } from "mongoose"

export interface Category {
    title: string
    color: string
    club: Types.ObjectId
}