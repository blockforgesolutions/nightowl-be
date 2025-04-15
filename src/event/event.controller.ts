import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { EventMessage } from './enums/event.enum';
import { EventResponse } from './model/event.response';
import { CreateEventDto } from './dto/create-event.dto';
import { CommonMessage } from 'src/common/enums/response/common-message.enum';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { PermissionAction } from 'src/common/enums/permission.enum';

@Controller('event')
@ApiTags('Event')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EventController {
    constructor(
        private readonly eventService: EventService
    ) { }

    @Post()
    @ApiSecurity('bearer')
    @RequirePermission('event', PermissionAction.CREATE)
    @ApiOperation({ summary: 'Create a new event', description: 'Returns the created event' })
    @ApiResponse({
        status: 201,
        description: EventMessage.CREATED,
        type: EventResponse
    })
    @ApiResponse({
        status: 400,
        description: EventMessage.ALREADY_EXISTS || CommonMessage.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    async createEvent(@Body() event: CreateEventDto){
        return await this.eventService.createEvent(event);
    }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Get all events', description: 'Returns all events' })
    @ApiResponse({
        status: 201,
        description: EventMessage.GET_ALL_EVENTS,
        type: [EventResponse]
    })
    async getEvents(): Promise<EventResponse[]> {
        return await this.eventService.getEvents();
    }

    @Get(':eventId')
    @Public()
    @ApiOperation({ summary: 'Get event', description: 'Returns the event with the given id' })
    @ApiResponse({
        status: 200,
        description: EventMessage.GET_EVENT,
        type: EventResponse
    })
    @ApiResponse({
        status: 404,
        description: EventMessage.NOT_FOUND,
    })
    async getEvent(@Param('eventId') eventId: string): Promise<EventResponse> {
        return await this.eventService.getEvent(eventId);
    }

    @Put(':eventId')
    @ApiSecurity('bearer')
    @RequirePermission('event', PermissionAction.UPDATE)
    @ApiOperation({ summary: 'Update event', description: 'Returns the updated event' })
    @ApiResponse({
        status: 200,
        description: EventMessage.UPDATED,
        type: EventResponse
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
        description: EventMessage.NOT_FOUND,
    })
    async updateEvent(@Param('eventId') eventId: string, @Body() event: CreateEventDto): Promise<EventResponse> {
        return await this.eventService.updateEvent(eventId, event);
    }

    @Delete(':eventId')
    @ApiSecurity('bearer')
    @RequirePermission('event', PermissionAction.DELETE)
    @ApiOperation({ summary: 'Delete event', description: 'Returns the deleted event message' })
    @ApiResponse({
        status: 200,
        description: EventMessage.DELETED,
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
        description: EventMessage.NOT_FOUND,
    })
    async deleteEvent(@Param('eventId') eventId: string): Promise<{ message: string }> {
        return await this.eventService.deleteEvent(eventId);
    }
}
