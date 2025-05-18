import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ example: "Product Name" })
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @ApiProperty({ example: 12.99 })
    @IsNumber()
    @IsNotEmpty()
    readonly price: number;
    
    @ApiProperty({ example: "Unit" })
    @IsString()
    @IsNotEmpty()
    readonly unit: string;
    
    @ApiProperty({ example: "67ec0cdc464f9688663f1700" })
    @IsString()
    @IsNotEmpty()
    readonly category: string;
    
    @ApiProperty({ example: "67ec0cdc464f9688663f1700" })
    @IsString()
    @IsNotEmpty()
    readonly club: string;
}