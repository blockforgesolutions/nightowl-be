import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderModel } from './order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/createOrder.dto';
import { ItemDto } from './dto/item.dto';
import { OrderResponse } from './model/order.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { OrderMessage } from 'src/order/enums/order-message.enum';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(OrderModel.name) private readonly orderModel: Model<OrderModel>
    ) { }

    async createOrder(order: CreateOrderDto): Promise<OrderResponse> {
        const newOrder = await this.orderModel.create(order);

        const transformedOrder = transformMongoData(newOrder.toObject(), OrderResponse);

        return transformedOrder;
    }

    async getOrders(): Promise<OrderResponse[]> {
        const orders = await this.orderModel.find().lean();

        const transformedOrders = transformMongoArray<OrderModel, OrderResponse>(orders);

        return transformedOrders;
    }

    async getOrderById(orderId: string): Promise<OrderResponse> {
        const order = await this.orderModel.findById(orderId).exec()

        if (!order) {
            throw new HttpException(OrderMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedOrder = transformMongoData(order, OrderResponse);

        return transformedOrder;
    }

    async getOrderByTableId(tableId: string): Promise<OrderResponse> {
        const order = await this.orderModel.findOne({ tableId: tableId }).lean()

        if (!order) {
            throw new HttpException(OrderMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedOrder = transformMongoData(order, OrderResponse);

        return transformedOrder;
    }

    async getOrdersByRegionId(regionId: string): Promise<OrderResponse[]> {
        const orders = await this.orderModel.find({ regionId: regionId }).lean();

        const transformedOrders = transformMongoArray<OrderModel, OrderResponse>(orders);

        return transformedOrders;
    }

    async updateOrder(orderId: string, items: ItemDto[]): Promise<OrderResponse> {
        const order = await this.orderModel.findById(orderId).exec();

        if (!order) {
            throw new HttpException(OrderMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        order.items = items.filter(item => item.quantity > 0);

        await order.save();

        const transformedOrder = transformMongoData(order, OrderResponse);
        return transformedOrder;
    }

    async deleteOrderItem(orderId: string, productId: string): Promise<OrderResponse> {
        const order = await this.orderModel.findById(orderId).exec()

        if (!order) {
            throw new HttpException(OrderMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const initialLength = order.items.length;

        order.items = order.items.filter(
            (item) => item.productId.toString() !== productId.toString()
        );

        if (order.items.length === initialLength) {
            throw new HttpException(OrderMessage.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        await order.save();

        const transformedOrder = transformMongoData(order, OrderResponse);
        return transformedOrder;
    }

    async deleteOrder(orderId: string): Promise<any> {
        const order = await this.orderModel.findByIdAndDelete(orderId);

        if (!order) {
            throw new HttpException(OrderMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return { message: OrderMessage.DELETED }
    }
}
