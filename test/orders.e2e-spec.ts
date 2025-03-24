import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../src/users/schemas/user.schema';
import { OrderStatus } from '../src/orders/schemas/order.schema';
import { ProductCategory } from '../src/orders/schemas/product.schema';
import { MongodbMemoryServer } from './mongodb-memory-server';

describe('Orders E2E Tests', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userToken: string;
  let adminToken: string;
  let clubOwnerToken: string;
  
  // Test verileri
  let clubId: string;
  let productId: string;
  let orderId: string;

  beforeAll(async () => {
    // MongoDB Memory Server başlat
    await MongodbMemoryServer.start();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            uri: configService.get<string>('MONGODB_URI'),
          }),
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }));
    app.setGlobalPrefix('api');
    
    await app.init();
    
    jwtService = app.get<JwtService>(JwtService);

    // Test için token oluşturma
    userToken = generateToken('user-id', UserRole.USER);
    adminToken = generateToken('admin-id', UserRole.ADMIN);
    clubOwnerToken = generateToken('owner-id', UserRole.CLUB_OWNER);
    
    // Test club oluşturma
    const clubResponse = await request(app.getHttpServer())
      .post('/api/clubs')
      .set('Authorization', `Bearer ${clubOwnerToken}`)
      .send({
        name: 'Test Club',
        description: 'Test Description',
        address: 'Test Address',
        city: 'Test City',
        latitude: 41.0082,
        longitude: 28.9784,
        capacity: 100,
      });
      
    clubId = clubResponse.body._id;
  });

  afterAll(async () => {
    await MongodbMemoryServer.stop();
    await app.close();
  });
  
  function generateToken(userId: string, role: UserRole): string {
    return jwtService.sign({ userId, role });
  }

  describe('Products', () => {
    it('should create a product', async () => {
      const createProductData = {
        name: 'Test Product',
        description: 'Test Product Description',
        price: 19.99,
        category: ProductCategory.DRINK,
        clubId,
      };
      
      const response = await request(app.getHttpServer())
        .post('/api/orders/products')
        .set('Authorization', `Bearer ${clubOwnerToken}`)
        .send(createProductData)
        .expect(201);
        
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(createProductData.name);
      expect(response.body.price).toBe(createProductData.price);
      
      productId = response.body._id;
    });
    
    it('should return all products for a club', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/orders/products?clubId=${clubId}`)
        .expect(200);
        
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].clubId).toBe(clubId);
    });
    
    it('should return a product by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/orders/products/${productId}`)
        .expect(200);
        
      expect(response.body._id).toBe(productId);
      expect(response.body.name).toBe('Test Product');
    });
    
    it('should update a product', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 24.99,
      };
      
      const response = await request(app.getHttpServer())
        .patch(`/api/orders/products/${productId}`)
        .set('Authorization', `Bearer ${clubOwnerToken}`)
        .send(updateData)
        .expect(200);
        
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
    });
  });
  
  describe('Orders', () => {
    it('should create an order', async () => {
      const createOrderData = {
        clubId,
        items: [
          {
            productId,
            quantity: 2,
          },
        ],
        notes: 'Test order notes',
      };
      
      const response = await request(app.getHttpServer())
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(createOrderData)
        .expect(201);
        
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('orderNumber');
      expect(response.body.status).toBe(OrderStatus.PENDING);
      expect(response.body.clubId).toBe(clubId);
      expect(response.body.items.length).toBe(1);
      
      orderId = response.body._id;
    });
    
    it('should return my orders', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/orders/my-orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
        
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]._id).toBe(orderId);
    });
    
    it('should return club orders', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/orders/club/${clubId}`)
        .set('Authorization', `Bearer ${clubOwnerToken}`)
        .expect(200);
        
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].clubId).toBe(clubId);
    });
    
    it('should update order status', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/orders/${orderId}/status/${OrderStatus.PREPARING}`)
        .set('Authorization', `Bearer ${clubOwnerToken}`)
        .expect(200);
        
      expect(response.body._id).toBe(orderId);
      expect(response.body.status).toBe(OrderStatus.PREPARING);
    });
  });
}); 