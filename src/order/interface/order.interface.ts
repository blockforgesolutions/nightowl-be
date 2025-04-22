import { Schema } from "mongoose";

export interface Items {
    productId: Schema.Types.ObjectId,
    quantity: number
}

export enum PaymentType {
    CASH = "cash",
    CREDIT_CARD = "credit-card",
    UNKNOWN = "unknown"
}

export interface Order {
    regionId: Schema.Types.ObjectId,
    tableId: Schema.Types.ObjectId,
    items: Items[],
    status:string,
    totalAmount:number,
    paymentType: PaymentType
}