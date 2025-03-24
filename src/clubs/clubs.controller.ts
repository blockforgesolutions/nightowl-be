import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { SearchClubsDto } from './dto/search-clubs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableStatus } from './schemas/table.schema';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_OWNER, UserRole.ADMIN)
  @Post()
  create(@Body() createClubDto: CreateClubDto, @Request() req) {
    return this.clubsService.create(createClubDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.clubsService.findAll();
  }

  @Get('search')
  search(@Query() searchDto: SearchClubsDto) {
    return this.clubsService.search(searchDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto, @Request() req) {
    return this.clubsService.update(id, updateClubDto, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.clubsService.remove(id, req.user.userId, req.user.role);
  }

  @Post(':clubId/tables')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLUB_OWNER)
  async createTable(
    @Param('clubId') clubId: string,
    @Body() createTableDto: CreateTableDto
  ) {
    return this.clubsService.createTable(clubId, createTableDto);
  }

  @Get(':clubId/tables')
  async findAllTables(@Param('clubId') clubId: string) {
    return this.clubsService.findAllTables(clubId);
  }

  @Get(':clubId/tables/available')
  async findAvailableTables(@Param('clubId') clubId: string) {
    return this.clubsService.findAvailableTables(clubId);
  }

  @Get('tables/:tableId')
  async findTableById(@Param('tableId') tableId: string) {
    return this.clubsService.findTableById(tableId);
  }

  @Patch('tables/:tableId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLUB_OWNER)
  async updateTable(
    @Param('tableId') tableId: string,
    @Body() updateTableDto: UpdateTableDto
  ) {
    return this.clubsService.updateTable(tableId, updateTableDto);
  }

  @Patch('tables/:tableId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLUB_OWNER)
  async updateTableStatus(
    @Param('tableId') tableId: string,
    @Body('status') status: TableStatus
  ) {
    return this.clubsService.updateTableStatus(tableId, status);
  }

  @Patch('tables/:tableId/assign-order/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLUB_OWNER)
  async assignOrderToTable(
    @Param('tableId') tableId: string,
    @Param('orderId') orderId: string
  ) {
    return this.clubsService.assignOrderToTable(tableId, orderId);
  }

  @Patch('tables/:tableId/remove-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLUB_OWNER)
  async removeOrderFromTable(@Param('tableId') tableId: string) {
    return this.clubsService.removeOrderFromTable(tableId);
  }

  @Delete('tables/:tableId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLUB_OWNER)
  async deleteTable(@Param('tableId') tableId: string) {
    return this.clubsService.deleteTable(tableId);
  }
} 