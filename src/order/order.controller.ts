import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { ApiResponseDto } from 'src/common/dto/response.dto';
import { Items } from './interface/order.interface';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) { }

    @Post()
    @HttpCode(201)
    async createOrder(@Body() order: CreateOrderDto) {
        const newOrder = await this.orderService.createOrder(order);

        return new ApiResponseDto(true, newOrder)
    }

    @Get()
    async getOrders() {
        const orders = await this.orderService.getOrders()

        return new ApiResponseDto(true, orders)
    }

    @Get(':orderId')
    async getOrderById(@Param('orderId') orderId: string) {
        const order = await this.orderService.getOrderById(orderId);

        return new ApiResponseDto(true, order)
    }

    @Get('table/:tableId')
    async getOrderByTableId(@Param('tableId') tableId: string) {
        const order = await this.orderService.getOrderByTableId(tableId);

        return new ApiResponseDto(true, order)
    }

    @Get('region/:regionId')
    async getOrdersByRegionId(@Param('regionId') regionId: string) {
        const orders = await this.orderService.getOrdersByRegionId(regionId);

        return new ApiResponseDto(true, orders)
    }

    @Put(':orderId')
    async updateOrder(@Param('orderId') orderId: string, @Body() items: Items[]) {
        const updatedOrder = await this.orderService.updateOrder(orderId, items)

        return new ApiResponseDto(true, updatedOrder)
    }

    @Delete(':orderId')
    async deleteOrder(@Param('orderId') orderId: string) {
        await this.orderService.deleteOrder(orderId);
    }
}
