import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../src/orders/orders.service';
import { getModelToken } from '@nestjs/mongoose';
import { Order, OrderStatus } from '../src/orders/schemas/order.schema';
import { OrderItem } from '../src/orders/schemas/order-item.schema';
import { Product, ProductCategory } from '../src/orders/schemas/product.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';

describe('OrdersService', () => {
  let service: OrdersService;
  
  const mockOrderModel = {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
    populate: jest.fn().mockReturnThis()
  };
  
  const mockOrderItemModel = {
    create: jest.fn().mockReturnThis()
  };
  
  const mockProductModel = {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([])
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: mockOrderModel,
        },
        {
          provide: getModelToken(OrderItem.name),
          useValue: mockOrderItemModel,
        },
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [
        {
          _id: '1',
          name: 'Product 1',
          description: 'Description 1',
          price: 10.99,
          category: ProductCategory.DRINK,
          clubId: 'club1',
        },
        {
          _id: '2',
          name: 'Product 2',
          description: 'Description 2',
          price: 20.99,
          category: ProductCategory.FOOD,
          clubId: 'club1',
        },
      ];

      mockProductModel.find.mockImplementation(() => ({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      }));

      const result = await service.findAllProducts('club1');
      expect(result).toEqual(mockProducts);
      expect(mockProductModel.find).toHaveBeenCalledWith({
        clubId: 'club1',
      });
    });

    it('should filter products by category when provided', async () => {
      const mockProducts = [
        {
          _id: '1',
          name: 'Product 1',
          description: 'Description 1',
          price: 10.99,
          category: ProductCategory.DRINK,
          clubId: 'club1',
        },
      ];

      mockProductModel.find.mockImplementation(() => ({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      }));

      const result = await service.findAllProducts('club1', ProductCategory.DRINK);
      expect(result).toEqual(mockProducts);
      expect(mockProductModel.find).toHaveBeenCalledWith({
        clubId: 'club1',
        category: ProductCategory.DRINK,
      });
    });
  });

  describe('findOneProduct', () => {
    it('should return a product by id', async () => {
      const mockProduct = {
        _id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 10.99,
      };

      mockProductModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockProduct),
      }));

      const result = await service.findOneProduct('1');
      expect(result).toEqual(mockProduct);
      expect(mockProductModel.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await expect(service.findOneProduct('999')).rejects.toThrow(NotFoundException);
      expect(mockProductModel.findById).toHaveBeenCalledWith('999');
    });
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        clubId: 'club1',
        items: [
          { productId: 'product1', quantity: 2 },
          { productId: 'product2', quantity: 1 },
        ],
      };

      const mockProducts = [
        {
          _id: 'product1',
          id: 'product1',
          name: 'Product 1',
          description: 'Product 1 Desc',
          price: 10.99,
          isAvailable: true,
        },
        {
          _id: 'product2',
          id: 'product2',
          name: 'Product 2',
          description: 'Product 2 Desc',
          price: 20.99,
          isAvailable: true,
        },
      ];

      // Mock findById
      mockProductModel.findById.mockImplementation((id) => {
        const product = mockProducts.find(p => p._id === id);
        return {
          exec: jest.fn().mockResolvedValue(product),
        };
      });

      // Mongoose constructor mockları
      const savedOrder = {
        _id: 'order1',
        id: 'order1',
        orderNumber: 'ORD12345',
        totalAmount: 42.97,
        status: OrderStatus.PENDING,
        clubId: 'club1',
        userId: 'user1',
        save: jest.fn().mockResolvedValue({
          _id: 'order1',
          id: 'order1'
        }),
      };

      // OrderItem create mocku
      mockOrderItemModel.create.mockResolvedValue({
        _id: 'item1',
        productName: 'Product 1',
        price: 10.99,
        quantity: 2
      });

      // Order create mocku
      mockOrderModel.create.mockResolvedValue({
        _id: 'order1',
        id: 'order1',
        orderNumber: 'ORD12345',
        totalAmount: 42.97,
        status: OrderStatus.PENDING,
        clubId: 'club1',
        userId: 'user1'
      });

      // findOne için mock
      mockOrderModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(savedOrder),
      }));

      const result = await service.createOrder(createOrderDto, 'user1');
      
      expect(result).toEqual(savedOrder);
    });

    it('should throw BadRequestException if product is not available', async () => {
      const createOrderDto = {
        clubId: 'club1',
        items: [
          { productId: 'product1', quantity: 2 },
        ],
      };

      const unavailableProduct = {
        _id: 'product1',
        name: 'Product 1',
        price: 10.99,
        isAvailable: false,
      };

      mockProductModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(unavailableProduct),
      }));

      await expect(service.createOrder(createOrderDto, 'user1')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if product not found', async () => {
      const createOrderDto = {
        clubId: 'club1',
        items: [
          { productId: 'nonexistent', quantity: 2 },
        ],
      };

      mockProductModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await expect(service.createOrder(createOrderDto, 'user1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const mockOrder = {
        _id: 'order1',
        status: OrderStatus.PENDING,
        save: jest.fn().mockImplementation(function() {
          this.status = OrderStatus.PREPARING;
          return Promise.resolve(this);
        }),
      };

      mockOrderModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockOrder),
      }));

      const result = await service.updateOrderStatus('order1', OrderStatus.PREPARING);
      
      expect(result.status).toEqual(OrderStatus.PREPARING);
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrderModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      await expect(service.updateOrderStatus('nonexistent', OrderStatus.PREPARING)).rejects.toThrow(NotFoundException);
    });
  });
}); 