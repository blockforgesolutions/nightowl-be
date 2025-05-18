import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CategoryMessage } from './enums/category-message.enum';
import { CategoryRespone } from './model/category.respone';
import { CommonMessage } from 'src/common/enums/response/common-message.enum';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { PermissionAction } from 'src/common/enums/permission.enum';

@Controller('category')
@ApiTags('Category')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Post()
    @HttpCode(201)
    @RequirePermission('category', PermissionAction.CREATE)
    @ApiOperation({ summary: 'Create a new category', description: 'Returns the created category' })
    @ApiResponse({
        status: 201,
        description: CategoryMessage.CREATED,
        type: CategoryRespone
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
    async createCategory(@Body() categoryDto: CategoryDto) {
        const category = await this.categoryService.createCategory(categoryDto);

        return category
    }

    @Get('/club/:clubId')
    @RequirePermission('category', PermissionAction.READ)
    @ApiOperation({ summary: 'Get categories by club', description: 'Returns the categories' })
    @ApiResponse({
        status: 200,
        description: CategoryMessage.GET_CLUB_CATEGORIES,
        type: [CategoryRespone]
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
        description: CategoryMessage.NOT_FOUND
    })
    async getCategoriesByclub(@Param('clubId') clubId: string) {
        const categories = await this.categoryService.getCategoriesByClub(clubId)

        return categories;
    }

    @Get(':categoryId')
    @RequirePermission('category', PermissionAction.READ)
    @ApiOperation({ summary: 'Get category', description: 'Returns the category' })
    @ApiResponse({
        status: 200,
        description: CategoryMessage.GET_CATEGORY,
        type: CategoryRespone
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
        description: CategoryMessage.NOT_FOUND
    })
    async getCategoryById(@Param('categoryId') categoryId: string) {
        const category = await this.categoryService.getCategoryById(categoryId);

        return category
    }

    @Put(':categoryId')
    @RequirePermission('category', PermissionAction.UPDATE)
    @ApiOperation({ summary: 'Update category', description: 'Returns the updated category' })
    @ApiResponse({
        status: 200,
        description: CategoryMessage.UPDATED,
        type: CategoryRespone
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
        description: CategoryMessage.NOT_FOUND
    })
    async updateCategory(@Param('categoryId') categoryId: string, @Body() categoryDto: CategoryDto) {
        const category = await this.categoryService.updateCategory(categoryId, categoryDto)

        return category
    }

    @Delete(':categoryId')
    @HttpCode(204)
    @RequirePermission('category', PermissionAction.DELETE)
    @ApiOperation({ summary: 'Delete category' })
    @ApiResponse({
        status: 204,
        description: CategoryMessage.DELETED,
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
        description: CategoryMessage.NOT_FOUND
    })
    async deleteCategory(@Param('categoryId') categoryId: string) {
        await this.categoryService.deleteCategory(categoryId)
    }
}
