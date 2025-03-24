import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../src/orders/orders.controller';
import { OrdersService } from '../src/orders/orders.service';
import { CreateOrderDto, OrderItemDto } from '../src/orders/dto/create-order.dto';
import { Order, OrderStatus } from '../src/orders/schemas/order.schema';
import { UserRole } from '../src/users/schemas/user.schema';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  // Mock service
  const mockOrdersService = {
    createOrder: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateOrder: jest.fn(),
    updateOrderStatus: jest.fn(),
    removeOrder: jest.fn(),
    createProduct: jest.fn(),
    findAllProducts: jest.fn(),
    findOneProduct: jest.fn(),
    updateProduct: jest.fn(),
    removeProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const orderItem: OrderItemDto = {
        productId: 'product1',
        quantity: 2,
      };
      
      const createOrderDto: CreateOrderDto = {
        clubId: 'club1',
        items: [orderItem],
      };
      
      const mockOrder: Partial<Order> = {
        _id: 'order1',
        orderNumber: 'ORD12345',
        status: OrderStatus.PENDING,
        totalAmount: 21.98,
      };
      
      mockOrdersService.createOrder.mockResolvedValue(mockOrder);
      
      const req = { user: { userId: 'user1' } };
      const result = await controller.createOrder(createOrderDto, req);
      
      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.createOrder).toHaveBeenCalledWith(createOrderDto, 'user1');
    });
  });

  describe('findMyOrders', () => {
    it('should return user orders', async () => {
      const mockOrders = [{ _id: 'order1' }, { _id: 'order2' }];
      
      mockOrdersService.findAll.mockResolvedValue(mockOrders);
      
      const req = { user: { userId: 'user1' } };
      const result = await controller.findMyOrders(req);
      
      expect(result).toEqual(mockOrders);
      expect(mockOrdersService.findAll).toHaveBeenCalledWith(undefined, 'user1');
    });
  });

  describe('findClubOrders', () => {
    it('should return club orders', async () => {
      const mockOrders = [{ _id: 'order1' }, { _id: 'order2' }];
      
      mockOrdersService.findAll.mockResolvedValue(mockOrders);
      
      const result = await controller.findClubOrders('club1');
      
      expect(result).toEqual(mockOrders);
      expect(mockOrdersService.findAll).toHaveBeenCalledWith('club1');
    });
  });

  describe('findAllOrders', () => {
    it('should return all orders', async () => {
      const mockOrders = [{ _id: 'order1' }, { _id: 'order2' }];
      
      mockOrdersService.findAll.mockResolvedValue(mockOrders);
      
      const result = await controller.findAllOrders();
      
      expect(result).toEqual(mockOrders);
      expect(mockOrdersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return order by id', async () => {
      const mockOrder = { _id: 'order1' };
      
      mockOrdersService.findOne.mockResolvedValue(mockOrder);
      
      const result = await controller.findOne('order1');
      
      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.findOne).toHaveBeenCalledWith('order1');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const mockOrder = {
        _id: 'order1',
        status: OrderStatus.PREPARING,
      };
      
      mockOrdersService.updateOrderStatus.mockResolvedValue(mockOrder);
      
      const result = await controller.updateOrderStatus('order1', OrderStatus.PREPARING);
      
      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.updateOrderStatus).toHaveBeenCalledWith('order1', OrderStatus.PREPARING);
    });
  });

  describe('findAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [{ _id: 'product1' }, { _id: 'product2' }];
      
      mockOrdersService.findAllProducts.mockResolvedValue(mockProducts);
      
      const result = await controller.findAllProducts('club1', 'drink');
      
      expect(result).toEqual(mockProducts);
      expect(mockOrdersService.findAllProducts).toHaveBeenCalledWith('club1', 'drink');
    });
  });

  describe('findOneProduct', () => {
    it('should return product by id', async () => {
      const mockProduct = { _id: 'product1' };
      
      mockOrdersService.findOneProduct.mockResolvedValue(mockProduct);
      
      const result = await controller.findOneProduct('product1');
      
      expect(result).toEqual(mockProduct);
      expect(mockOrdersService.findOneProduct).toHaveBeenCalledWith('product1');
    });
  });
}); 