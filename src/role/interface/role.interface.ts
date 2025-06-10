import { Types } from "mongoose";

export interface Role {
    name: string,
    privileges: Types.ObjectId[]
}
