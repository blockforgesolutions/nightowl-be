import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RoleMessages } from './enums/role.enum';
import { RoleResponse } from './model/role.response';
import { CommonMessage } from 'src/common/enums/response/common-message.enum';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { PermissionAction } from 'src/common/enums/permission.enum';

@Controller('role')
@ApiTags('Roles')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard, RoleGuard, PermissionsGuard)
export class RoleController {
    constructor(
        private readonly roleService: RoleService
    ) { }

    @Post()
    @HttpCode(201)
    @RequirePermission('role', PermissionAction.CREATE)
    @ApiOperation({ summary: 'Create a new privilege', description: 'Returns the created role' })
    @ApiResponse({
        status: 201,
        description: RoleMessages.CREATED,
        type: RoleResponse
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
    async createRole(@Body() roleDto: RoleDto) {
        const role = await this.roleService.createRole(roleDto)

        return role
    }

    @Get()
    // @Roles(BaseRoles.SUPER_ADMIN, BaseRoles.OWNER)
    @ApiOperation({ summary: 'Get all roles', description: 'Returns all roles' })
    @ApiResponse({
        status: 200,
        description: "Returns all roles",
        type: RoleResponse
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    async getRoles() {
        const roles = await this.roleService.getRoles()

        return roles
    }

    @Get(':roleId')
    @ApiOperation({ summary: 'Get rolee', description: 'Returns role' })
    @ApiResponse({
        status: 200,
        description: "Returns role",
        type: RoleResponse
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
        description: RoleMessages.NOT_FOUND
    })
    async getRoleById(@Param('roleId') roleId: string) {
        const role = await this.roleService.getRoleById(roleId)

        return role
    }

    @Put(':roleId')
    @ApiOperation({ summary: 'Update a privilege', description: 'Returns the updated role' })
    @ApiResponse({
        status: 200,
        description: RoleMessages.UPDATED,
        type: RoleResponse
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
        description: RoleMessages.NOT_FOUND
    })
    async updateRole(@Param('roleId') roleId: string, @Body() roleDto: RoleDto) {
        const role = await this.roleService.updateRole(roleId, roleDto)

        return role
    }

    @Patch(':roleId/privileges/:privilegeId')
    @ApiOperation({ summary: 'Update a privilege', description: 'Returns the updated role' })
    @ApiResponse({
        status: 200,
        description: RoleMessages.UPDATED,
        type: RoleResponse
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
        description: RoleMessages.NOT_FOUND
    })
    async addPrivilege(@Param('roleId') roleId: string, @Param('privilegeId') privilegeId: string) {
        const role = await this.roleService.addPrivilege(roleId, privilegeId)

        return role
    }

    @Delete(':roleId')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a privilege', description: 'Returns the deleted message' })
    @ApiResponse({
        status: 204,
        description: RoleMessages.DELETED,
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
        description: RoleMessages.NOT_FOUND
    })
    async deleteRole(@Param('roleId') roleId: string) {
        await this.roleService.deleteRole(roleId)
    }
}
