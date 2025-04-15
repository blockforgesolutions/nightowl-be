import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { PermissionAction } from 'src/common/enums/permission.enum';
import { TicketResponse } from './model/ticket.response';
import { TicketMessage } from './enums/ticket.enum';
import { CommonMessage } from 'src/common/enums/response/common-message.enum';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('ticket')
@ApiTags('Ticket')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TicketController {
    constructor(
        private readonly ticketService: TicketService
    ) { }

    @Post()
    @RequirePermission('ticket', PermissionAction.CREATE)
    @ApiOperation({ summary: 'Create Ticket', description: 'Returns the created ticket' })
    @ApiResponse({
        status: 201,
        description: TicketMessage.CREATED,
        type: TicketResponse
    })
    @ApiResponse({
        status: 400,
        description: CommonMessage.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.INVALID_CREDENTIALS,
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.INVALID_CREDENTIALS,
    })
    async createTicket(@Body() ticket: CreateTicketDto) {
        return await this.ticketService.createTicket(ticket);
    }


    @Get(':ticketId')
    @RequirePermission('ticket', PermissionAction.READ)
    @ApiOperation({ summary: 'Get Ticket', description: 'Returns the ticket' })
    @ApiResponse({
        status: 200,
        description: TicketMessage.GET_Ticket,
        type: TicketResponse
    })
    @ApiResponse({
        status: 400,
        description: CommonMessage.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.INVALID_CREDENTIALS,
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.INVALID_CREDENTIALS,
    })
    @ApiResponse({
        status: 404,
        description: TicketMessage.NOT_FOUND,
    })
    async getTicketById(@Param('ticketId') ticketId: string) {
        return await this.ticketService.getTicketById(ticketId);
    }

    @Get('/by-session/:sessionId')
    @RequirePermission('ticket', PermissionAction.READ)
    @ApiOperation({ summary: 'Get Ticket', description: 'Returns the ticket' })
    @ApiResponse({
        status: 200,
        description: TicketMessage.GET_Ticket,
        type: TicketResponse
    })
    @ApiResponse({
        status: 400,
        description: CommonMessage.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.INVALID_CREDENTIALS,
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.INVALID_CREDENTIALS,
    })
    @ApiResponse({
        status: 404,
        description: TicketMessage.NOT_FOUND,
    })
    async getTicketBySession(@Param('sessionId') sessionId: string) {
        return await this.ticketService.getTicketBySession(sessionId);
    }

    @Put(':ticketId')
    @RequirePermission('ticket', PermissionAction.UPDATE)
    @ApiOperation({ summary: 'Update Ticket', description: 'Returns the updated ticket' })
    @ApiResponse({
        status: 200,
        description: TicketMessage.UPDATED,
        type: TicketResponse
    })
    @ApiResponse({
        status: 400,
        description: CommonMessage.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.INVALID_CREDENTIALS,
    })    
    @ApiResponse({
        status: 403,
        description: CommonMessage.INVALID_CREDENTIALS,
    })
    @ApiResponse({
        status: 404,
        description: TicketMessage.NOT_FOUND,
    })
    async updateTicket(@Param('ticketId') ticketId: string, @Body() ticket: UpdateTicketDto): Promise<TicketResponse> {
        return await this.ticketService.updateTicket(ticketId, ticket);
    }


    @Delete(':ticketId')
    @RequirePermission('ticket', PermissionAction.DELETE)
    @ApiOperation({ summary: 'Delete Ticket', description: 'Returns no content' })
    @ApiResponse({
        status: 204,
        description: TicketMessage.DELETED,
    })
    @ApiResponse({
        status: 400,
        description: CommonMessage.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.INVALID_CREDENTIALS,
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.INVALID_CREDENTIALS,
    })
    @ApiResponse({
        status: 404,
        description: TicketMessage.NOT_FOUND,
    })
    async deleteTicket(@Param('ticketId') ticketId: string): Promise<{ message: string }> {
        return await this.ticketService.deleteTicket(ticketId);
    }

}
