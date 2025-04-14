import { Schema } from "mongoose";

export interface Product {
    name: string;
    price: number;
    unit: string;
    category: Schema.Types.ObjectId;
    club: Schema.Types.ObjectId;
}