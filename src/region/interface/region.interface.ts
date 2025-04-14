import { Schema } from "mongoose";

export interface Region {
    name: string,
    club: Schema.Types.ObjectId
}