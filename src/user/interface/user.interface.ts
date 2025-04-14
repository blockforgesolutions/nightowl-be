import { Schema } from "mongoose"


export interface User {
    fullName: string,
    email: string,
    password: string,
    phoneNumber: string,
    role: Schema.Types.ObjectId,
    lastEntry?: Date
    lastExit?: Date,
    club: Schema.Types.ObjectId
}