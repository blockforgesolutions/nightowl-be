import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { Product, ProductCategory } from './schemas/product.schema';
import { OrderItem } from './schemas/order-item.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ClubsService } from '../clubs/clubs.service';
import { TableStatus } from '../clubs/schemas/table.schema';
import * as crypto from 'crypto';

interface OrderItemResponse {
  _id: string;
  [key: string]: any;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
    @InjectModel(OrderItem.name)
    private orderItemModel: Model<OrderItem>,
    @InjectModel(Product.name)
    private productModel: Model<Product>,
    private clubsService: ClubsService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    // Benzersiz sipariş numarası oluştur
    const orderNumber = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Siparişin toplam tutarını hesapla
    let totalAmount = 0;
    const orderItemIds: string[] = [];
    
    // Her ürün için sipariş öğeleri oluştur
    for (const item of createOrderDto.items) {
      const product = await this.productModel.findById(item.productId).exec();
      
      if (!product) {
        throw new NotFoundException(`${item.productId} ID'li ürün bulunamadı`);
      }
      
      if (!product.isAvailable) {
        throw new BadRequestException(`${product.name} ürünü şu anda mevcut değil`);
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      // Sipariş öğesi oluştur
      const orderItem = await this.orderItemModel.create({
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        productId: product.id,
        notes: item.notes,
      }) as OrderItemResponse;
      
      orderItemIds.push(orderItem._id);
    }
    
    // Sipariş verisi oluştur
    const orderData: any = {
      orderNumber,
      totalAmount,
      userId,
      clubId: createOrderDto.clubId,
      notes: createOrderDto.notes,
      status: OrderStatus.PENDING,
      items: orderItemIds,
    };
    
    // Eğer masa ID'si belirtilmişse, ekle
    if (createOrderDto.tableId) {
      // Masa mevcut mu ve uygun durumda mı kontrol et
      const table = await this.clubsService.findTableById(createOrderDto.tableId);
      
      if (table.status !== TableStatus.AVAILABLE && table.status !== TableStatus.RESERVED) {
        throw new BadRequestException(`Masa şu anda sipariş almak için uygun değil`);
      }
      
      orderData.tableId = createOrderDto.tableId;
      
      // Siparişi kaydettikten sonra masayı güncelleyeceğiz
    }
    
    // Yeni sipariş oluştur ve kaydet
    const createdOrder = await this.orderModel.create(orderData);
    
    // Eğer sipariş bir masaya atanmışsa, masanın durumunu güncelle
    if (createOrderDto.tableId) {
      await this.clubsService.assignOrderToTable(
        createOrderDto.tableId,
        createdOrder._id.toString()
      );
    }
    
    // Kaydedilen siparişi ID'ye göre veritabanından çek (items ile birlikte)
    try {
      // createdOrder'ın bir id veya _id alanı olabilir, her ikisini de kontrol edelim
      const orderId = createdOrder?.id || createdOrder?._id || (createdOrder as any)?._id;
      
      if (orderId) {
        return this.findOne(orderId.toString());
      } else {
        // ID bulunamazsa, oluşturulan nesneyi doğrudan döndür
        return createdOrder as unknown as Order;
      }
    } catch (error) {
      // Hata oluşursa, oluşturulan sipariş nesnesini doğrudan döndür
      return createdOrder as unknown as Order;
    }
  }

  async findAll(clubId?: string, userId?: string): Promise<Order[]> {
    let query = {};
    
    if (clubId) {
      query = { ...query, clubId };
    }
    
    if (userId) {
      query = { ...query, userId };
    }
    
    return this.orderModel.find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id)
      .populate('items')
      .exec();
    
    if (!order) {
      throw new NotFoundException(`${id} ID'li sipariş bulunamadı`);
    }
    
    return order;
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }
    
    if (updateOrderDto.notes !== undefined) {
      order.notes = updateOrderDto.notes;
    }
    
    await order.save();
    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    await order.save();
    
    // Sipariş teslim edildi veya iptal edildi ise masayı serbest bırak
    if (order.tableId && (status === OrderStatus.DELIVERED || status === OrderStatus.CANCELLED)) {
      await this.clubsService.removeOrderFromTable(order.tableId.toString());
    }
    
    return order;
  }

  async removeOrder(id: string): Promise<void> {
    const order = await this.findOne(id);
    
    // Eğer sipariş bir masaya atanmışsa, masayı serbest bırak
    if (order.tableId) {
      await this.clubsService.removeOrderFromTable(order.tableId.toString());
    }
    
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`${id} ID'li sipariş bulunamadı`);
    }
  }

  // Product işlemleri
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.productModel.create(createProductDto);
    return product;
  }

  async findAllProducts(clubId?: string, category?: string): Promise<Product[]> {
    const query: any = {};
    
    if (clubId) {
      query.clubId = clubId;
    }
    
    if (category) {
      query.category = category;
    }
    
    return this.productModel.find(query)
      .sort({ name: 1 })
      .exec();
  }

  async findOneProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    
    if (!product) {
      throw new NotFoundException(`${id} ID'li ürün bulunamadı`);
    }
    
    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOneProduct(id);
    
    Object.assign(product, updateProductDto);
    await product.save();
    return product;
  }

  async removeProduct(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`${id} ID'li ürün bulunamadı`);
    }
  }
} 