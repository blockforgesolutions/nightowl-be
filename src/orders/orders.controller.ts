import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { OrderStatus } from './schemas/order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.createOrder(createOrderDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  findMyOrders(@Request() req) {
    return this.ordersService.findAll(undefined, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_OWNER, UserRole.ADMIN)
  @Get('club/:clubId')
  findClubOrders(@Param('clubId') clubId: string) {
    return this.ordersService.findAll(clubId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAllOrders() {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_OWNER, UserRole.ADMIN)
  @Patch(':id/status/:status')
  updateOrderStatus(
    @Param('id') id: string,
    @Param('status') status: OrderStatus,
  ) {
    return this.ordersService.updateOrderStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  removeOrder(@Param('id') id: string) {
    return this.ordersService.removeOrder(id);
  }

  // Ürün endpoint'leri
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_OWNER, UserRole.ADMIN)
  @Post('products')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.ordersService.createProduct(createProductDto);
  }

  @Get('products')
  findAllProducts(@Query('clubId') clubId: string, @Query('category') category: string) {
    return this.ordersService.findAllProducts(clubId, category);
  }

  @Get('products/:id')
  findOneProduct(@Param('id') id: string) {
    return this.ordersService.findOneProduct(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_OWNER, UserRole.ADMIN)
  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.ordersService.updateProduct(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_OWNER, UserRole.ADMIN)
  @Delete('products/:id')
  removeProduct(@Param('id') id: string) {
    return this.ordersService.removeProduct(id);
  }
} 