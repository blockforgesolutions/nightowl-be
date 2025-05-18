import { Body, Controller, Delete, Get, HttpCode, Post, Put, Request, UseGuards } from '@nestjs/common';
import { PrivilegesService } from './privileges.service';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PrivilegeDto } from './dto/create-privilege.dto';
import { PrivilegeResponse } from './model/privilege.response';
import { PrivilegeMessage } from './enums/privilege-message.enum';
import { CommonMessage } from 'src/common/enums/response/common-message.enum';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { PermissionAction } from 'src/common/enums/permission.enum';

@Controller('privileges')
@ApiTags('Privileges')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PrivilegesController {
    constructor(
        private privilegesService: PrivilegesService
    ) { }

    @Post()
    @HttpCode(201)
    @RequirePermission('privilege', PermissionAction.CREATE)
    @ApiOperation({ summary: 'Create a new privilege', description: 'Returns the created privilege' })
    @ApiResponse({
        status: 201,
        description: PrivilegeMessage.CREATED,
        type: PrivilegeResponse
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
    async createPrivilege(@Request() req, @Body() privilege: PrivilegeDto): Promise<PrivilegeResponse> {
        return await this.privilegesService.createPrivilege(req.user.sub, privilege);
    }


    @Get()
    @RequirePermission('privilege', PermissionAction.READ)
    @ApiOperation({ summary: 'Get all privileges', description: 'Returns all privilege' })
    @ApiResponse({
        status: 200,
        description: PrivilegeMessage.GET_ALL_PRIVILEGES,
        type: PrivilegeResponse
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    async getPrivileges(): Promise<PrivilegeResponse[]> {
        return await this.privilegesService.getPrivileges();
    }

    @Get(':privilegeId')
    @RequirePermission('privilege', PermissionAction.READ)
    @ApiOperation({ summary: 'Get a privilege', description: 'Returns a privilege' })
    @ApiResponse({
        status: 200,
        description: PrivilegeMessage.GET_PRIVILEGE,
        type: PrivilegeResponse
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
        description: PrivilegeMessage.NOT_FOUND
    })
    async getPrivilegeById(@Body() privilegeId: string): Promise<PrivilegeResponse> {
        return await this.privilegesService.getPrivilegeById(privilegeId);
    }

    @Put(':privilegeId')
    @RequirePermission('privilege', PermissionAction.UPDATE)
    @ApiOperation({ summary: 'Update a privilege', description: 'Returns the updated privilege' })
    @ApiResponse({
        status: 200,
        description: PrivilegeMessage.UPDATED,
        type: PrivilegeResponse
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
        description: PrivilegeMessage.NOT_FOUND
    })
    async updatePrivilege(@Body() privilegeId: string, @Body() privilege: PrivilegeDto): Promise<PrivilegeResponse> {
        return await this.privilegesService.updatePrivilege(privilegeId, privilege);
    }

    @Delete(':privilegeId')
    @RequirePermission('privilege', PermissionAction.DELETE)
    @ApiOperation({ summary: 'Delete a privilege', description: 'Returns the deleted privilege' })
    @ApiResponse({
        status: 200,
        description: PrivilegeMessage.DELETED,
        type: PrivilegeResponse
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
        description: PrivilegeMessage.NOT_FOUND
    })
    async deletePrivilege(@Body() privilegeId: string): Promise<{ message: string }> {
        return await this.privilegesService.deletePrivilege(privilegeId);
    }
}
