import { Body, Controller, Delete, Get, HttpCode, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { PermissionAction } from 'src/common/enums/permission.enum';
import { UserResponse } from './model/user.response';
import { CommonMessage } from 'src/common/enums/response/common-message.enum';
import { UserMessages } from './enums/user.enum';

@Controller('user')
@ApiTags('User')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    // @Post()
    // @HttpCode(201)
    // @Public()
    // async createUser(@Body() createUserDto: CreateUserDto) {
    //     const user = await this.userService.createUser(createUserDto)

    //     return new ApiResponseDto(true, user)
    // }

    @Get()
    @RequirePermission('user', PermissionAction.READ)
    @ApiOperation({ summary: 'Get all users', description: 'Returns all users' })
    @ApiResponse({
        status: 200,
        description: 'Returns all users',
        type: [UserResponse]
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    async getUsers() {
        const users = await this.userService.getUsers()

        return users
    }

    @Get(':userId')
    @RequirePermission('user', PermissionAction.READ)
    @ApiOperation({ summary: 'Get all users', description: 'Returns all users' })
    @ApiResponse({
        status: 200,
        description: 'Returns all users',
        type: UserResponse
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
        description: UserMessages.NOT_FOUND
    })
    async getUserById(@Param('userId') userId: string) {
        const user = await this.userService.getUserById(userId)

        return user
    }

    // @Get('/email')
    // async getUserByEmail(@Query('email') email: string) {
    //     const user = await this.userService.getUserByEmail(email)
    //     return new ApiResponseDto(true, user)
    // }

    // @Get('/phoneNumber')
    // async getUserByPhoneNumber(@Query('phoneNumber') phoneNumber: string) {
    //     const user = await this.userService.getUserByPhoneNumber(phoneNumber)

    //     return new ApiResponseDto(true, user)
    // }

    @Put(':userId')
    @RequirePermission('user', PermissionAction.UPDATE)
    @ApiOperation({ summary: 'Update user', description: 'Returns updated user' })
    @ApiResponse({
        status: 200,
        description: UserMessages.UPDATED,
        type: UserResponse
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
        description: UserMessages.NOT_FOUND
    })
    async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.userService.updateUser(userId, updateUserDto)

        return user
    }

    @Delete(':userId')
    @HttpCode(204)
    @RequirePermission('user', PermissionAction.DELETE)
    @ApiOperation({ summary: 'Delete user', description: 'Return No Content' })
    @ApiResponse({
        status: 204,
        description: UserMessages.DELETED,
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
        description: UserMessages.NOT_FOUND
    })
    async deleteUser(@Param('userId') userId: string) {
        await this.userService.deleteUser(userId)
    }
}
