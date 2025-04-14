import { Schema } from "mongoose";

export interface Items {
    productId: Schema.Types.ObjectId,
    quantity: number
}

export enum PaymentType {
    CASH = "nakit",
    CREDIT_CARD = "kredi kartı",
    UNKNOWN = "bilinmiyor"
}

export interface Order {
    regionId: Schema.Types.ObjectId,
    tableId: Schema.Types.ObjectId,
    items: Items[],
    status:string,
    totalAmount:number,
    paymentType: PaymentType
}