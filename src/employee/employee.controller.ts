import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { CreateEmployeeDto } from './dto/createEmployee.dto';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { PermissionAction } from 'src/common/enums/permission.enum';
import { EmployeeMessages } from './enums/employee.enum';
import { EmployeeResponse } from './model/employee.response';
import { CommonMessage } from 'src/common/enums/response/common-message.enum';
import { UpdateEmployeeDto } from './dto/updateEmployee.dto';
import { User as UserDecorator } from '../common/decorators/user.decorator';


@Controller('employee')
@ApiTags('Employee')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
    constructor(
        private readonly employeeService: EmployeeService
    ) { }

    @Post()
    @RequirePermission('employee', PermissionAction.CREATE)
    @ApiOperation({ summary: 'Create employee', description: 'Returns the created employee' })
    @ApiResponse({
        status: 201,
        description: EmployeeMessages.CREATED,
        type: EmployeeResponse
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
        status: 409,
        description: EmployeeMessages.EMAIL_ALREADY_REGISTERED
    })
    async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
        return await this.employeeService.createEmployee(createEmployeeDto);
    }

    @Get('/getClubEmployees/:clubId')
    @RequirePermission('employee', PermissionAction.READ)
    @ApiOperation({ summary: 'Get club employees', description: 'Returns the club employees' })
    @ApiResponse({
        status: 200,
        description: "Returns the club employees",
        type: [EmployeeResponse]
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    async getClubEmployees(@Param('clubId') clubId: string) {
        return await this.employeeService.getClubEmployees(clubId);
    }


    @Get('current')
    @ApiOperation({ summary: 'Get current user', description: 'Returns the authenticated user\'s information' })
    @ApiResponse({
        status: 200,
        description: 'Returns current user information',
        type: EmployeeResponse
    })
    @ApiResponse({ status: 401, description: CommonMessage.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: CommonMessage.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: EmployeeMessages.NOT_FOUND })
    getCurrent(@UserDecorator('sub') id: string): Promise<EmployeeResponse> {
        return this.employeeService.getEmployeeById(id);
    }

    @Get(':employeeId')
    @RequirePermission('employee', PermissionAction.READ)
    @ApiOperation({ summary: 'Get employee', description: 'Returns the employee' })
    @ApiResponse({
        status: 200,
        description: 'Returns the employee',
        type: EmployeeResponse
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
        description: EmployeeMessages.NOT_FOUND
    })
    async getEmployeeById(@Param('employeeId') employeeId: string) {
        return await this.employeeService.getEmployeeById(employeeId);
    }


    @Get('/email')
    @RequirePermission('employee', PermissionAction.READ)
    @ApiOperation({ summary: 'Get employee by email', description: 'Returns the employee' })
    @ApiResponse({
        status: 200,
        description: 'Returns the employee',
        type: EmployeeResponse
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
        description: EmployeeMessages.NOT_FOUND
    })
    async getEmployeeByEmail(@Body('email') email: string) {
        return await this.employeeService.getEmployeeByEmail(email);
    }

    @Put(':employeeId')
    @RequirePermission('employee', PermissionAction.UPDATE)
    @ApiOperation({ summary: 'Update employee', description: 'Returns the updated employee' })
    @ApiResponse({
        status: 200,
        description: EmployeeMessages.UPDATED,
        type: EmployeeResponse
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
        description: EmployeeMessages.NOT_FOUND
    })
    async updateEmployee(@Param('employeeId') employeeId: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        return await this.employeeService.updateEmployee(employeeId, updateEmployeeDto);
    }

    @Delete(':employeeId')
    @RequirePermission('employee', PermissionAction.DELETE)
    @ApiOperation({ summary: 'Delete employee', description: 'Returns the deleted message' })
    @ApiResponse({
        status: 200,
        description: EmployeeMessages.DELETED,
        type: String
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
        description: EmployeeMessages.NOT_FOUND
    })
    async deleteEmployee(@Param('employeeId') employeeId: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.employeeService.deleteEmployee(employeeId);
    }

}
