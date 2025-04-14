import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { PaymentType } from "../interface/order.interface"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateOrderDto {
    @ApiProperty({ example: 150 })
    @IsNotEmpty()
    @IsNumber()
    totalAmount:number

    @ApiProperty({ example: "cash" })
    @IsString()
    @IsNotEmpty()
    paymentType: PaymentType
}