import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

class ProductsResponse {
    @ApiProperty({ example: "67ec0cdc464f9688663f1700" })
    id: string

    @ApiProperty({ example: "Product Name" })
    name: string

    @ApiProperty({ example: 10 })
    price: number

    @ApiProperty({ example: 2 })
    quantity: number

}

export class OrderResponse {
    @ApiProperty({ example: "67ec0cdc464f9688663f1700" })
    id: string

    @ApiProperty({ example: "67ec0cdc464f9688663f1700" })
    regionId: Types.ObjectId

    @ApiProperty({ example: "67ec0cdc464f9688663f1700" })
    tableId: Types.ObjectId

    @ApiProperty({ type: [ProductsResponse] })
    items: ProductsResponse[]

    @ApiProperty({ example: "pending" })
    status: string

    @ApiProperty({ example: 10 })
    totalAmount: number

    @ApiProperty({ example: "cash" })
    paymentType: string
}