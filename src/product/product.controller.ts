import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { ApiResponseDto } from 'src/common/dto/response.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ProductMessages } from './enums/product.enum';
import { ProductResponse } from './model/product.response';
import { CommonMessage } from 'src/common/enums/response/common-message.enum';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { PermissionAction } from 'src/common/enums/permission.enum';

@Controller('product')
@ApiTags('Product')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Post()
    @HttpCode(201)
    @RequirePermission('product', PermissionAction.CREATE)
    @ApiOperation({ summary: 'Create a new product', description: 'Returns the created product' })
    @ApiResponse({
        status: 201,
        description: ProductMessages.CREATED,
        type: ProductResponse
    })
    @ApiResponse({
        status: 400,
        description: CommonMessage.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    async createProduct(@Body() createProductDto: CreateProductDto) {
        const product = await this.productService.createProduct(createProductDto);

        return product
    }

    @Get()
    @RequirePermission('product', PermissionAction.READ)
    @ApiOperation({ summary: 'Get all products', description: 'Returns the list of products' })
    @ApiResponse({
        status: 200,
        description: ProductMessages.GET_ALL_PRODUCTS,
        type: [ProductResponse]
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    async getProducts() {
        const products = await this.productService.getProducts();

        return products
    }

    @Get(':productId')
    @RequirePermission('product', PermissionAction.READ)
    @ApiOperation({ summary: 'Get a product', description: 'Returns the product' })
    @ApiResponse({
        status: 200,
        description: ProductMessages.GET_PRODUCT,
        type: ProductResponse
    })
    @ApiResponse({
        status: 400,
        description: CommonMessage.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 404,
        description: ProductMessages.NOT_FOUND
    })
    async getProductById(@Param('productId') productId: string) {
        const product = await this.productService.getProductById(productId);

        return new ApiResponseDto(true, product)
    }

    @Get('category/:categoryId')
    @RequirePermission('product', PermissionAction.READ)
    @ApiOperation({ summary: 'Get category products', description: 'Returns the category products' })
    @ApiResponse({
        status: 200,
        description: ProductMessages.GET_ALL_PRODUCTS,
        type: [ProductResponse]
    })
    @ApiResponse({
        status: 400,
        description: CommonMessage.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 404,
        description: ProductMessages.NOT_FOUND
    })
    async getProductsByCategory(@Param('categoryId') category: string) {
        const products = await this.productService.getProductsByCategory(category);

        return products
    }

    @Get('club/:clubId')
    @RequirePermission('product', PermissionAction.READ)
    @ApiOperation({ summary: 'Get club products', description: 'Returns the club products' })
    @ApiResponse({
        status: 200,
        description: ProductMessages.GET_CLUB_PRODUCTS,
        type: [ProductResponse]
    })
    @ApiResponse({
        status: 400,
        description: CommonMessage.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 404,
        description: ProductMessages.NOT_FOUND
    })
    async getProductsByClub(@Param('clubId') club: string) {
        const products = await this.productService.getProductsByClub(club);

        return products
    }

    @Put(':productId')
    @RequirePermission('product', PermissionAction.READ)
    @ApiOperation({ summary: 'Update a product', description: 'Returns the updated product' })
    @ApiResponse({
        status: 200,
        description: ProductMessages.UPDATED,
        type: ProductResponse
    })
    @ApiResponse({
        status: 400,
        description: CommonMessage.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 404,
        description: ProductMessages.NOT_FOUND
    })
    async updateProduct(@Param('productId') productId: string, @Body() updateProductDto: UpdateProductDto) {
        const updatedProduct = await this.productService.updateProduct(productId, updateProductDto);

        return updatedProduct
    }

    @Delete(':productId')
    @HttpCode(204)
    @RequirePermission('product', PermissionAction.READ)
    @ApiOperation({ summary: 'Delete a product', description: 'Returns the deleted message' })
    @ApiResponse({
        status: 204,
        description: ProductMessages.DELETED,
    })
    @ApiResponse({
        status: 400,
        description: CommonMessage.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 404,
        description: ProductMessages.NOT_FOUND
    })
    async deleteProduct(@Param('productId') productId: string) {
        await this.productService.deleteProduct(productId);
    }
}
