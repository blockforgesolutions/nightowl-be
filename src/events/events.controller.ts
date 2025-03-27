import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SearchEventsDto } from './dto/search-events.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ObjectIdValidationPipe } from '../common/pipes/objectid-validation.pipe';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_OWNER, UserRole.ADMIN)
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('search')
  search(@Query() searchDto: SearchEventsDto) {
    return this.eventsService.search(searchDto);
  }

  @Get(':id')
  findOne(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ObjectIdValidationPipe) id: string, 
    @Body() updateEventDto: UpdateEventDto, 
    @Request() req
  ) {
    // MongoDB ID formatına geçiş nedeniyle placeholder olarak boş string kullanıyoruz
    return this.eventsService.update(
      id, 
      updateEventDto, 
      req.user.userId, 
      req.user.role,
      req.user.userId // Artık MongoDB ID kullanıldığı için kullanıcının kendi ID'sini kullanabiliriz
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ObjectIdValidationPipe) id: string, 
    @Request() req
  ) {
    // MongoDB ID formatına geçiş nedeniyle placeholder olarak boş string kullanıyoruz
    return this.eventsService.remove(
      id, 
      req.user.userId, 
      req.user.role,
      req.user.userId // Artık MongoDB ID kullanıldığı için kullanıcının kendi ID'sini kullanabiliriz
    );
  }
} 