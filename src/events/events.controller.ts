import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SearchEventsDto } from './dto/search-events.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

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
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateEventDto: UpdateEventDto, 
    @Request() req
  ) {
    // Burada normalde kulüp sahibinin ID'si, ilgili event'in bulunduğu clubId'nin sahibinden gelmelidir.
    // Basitlik için bu kontrolü service katmanına bırakıyoruz.
    return this.eventsService.update(
      id, 
      updateEventDto, 
      req.user.userId, 
      req.user.role,
      '00000000-0000-0000-0000-000000000000' // Bu placeholder değer, gerçek uygulamada ilgili kulübün sahibinin ID'si ile değiştirilmelidir
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string, 
    @Request() req
  ) {
    // Burada normalde kulüp sahibinin ID'si, ilgili event'in bulunduğu clubId'nin sahibinden gelmelidir.
    // Basitlik için bu kontrolü service katmanına bırakıyoruz.
    return this.eventsService.remove(
      id, 
      req.user.userId, 
      req.user.role,
      '00000000-0000-0000-0000-000000000000' // Bu placeholder değer, gerçek uygulamada ilgili kulübün sahibinin ID'si ile değiştirilmelidir
    );
  }
} 