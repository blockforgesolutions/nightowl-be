import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ClubResponse } from './model/club.response';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ClubMessage } from './enums/club-message.enum';
import { CommonMessage } from 'src/common/enums/response/common-message.enum';
import { Public } from 'src/common/decorators/public.decorator';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { PermissionAction } from 'src/common/enums/permission.enum';

@Controller('club')
@ApiTags('Club')
@ApiSecurity('Bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ClubController {
    constructor(
        private readonly clubService: ClubService
    ) { }

    @Post()
    @HttpCode(201)
    @RequirePermission('club', PermissionAction.CREATE)
    @ApiOperation({ summary: 'Create a new club', description: 'Returns the created club' })
    @ApiResponse({
        status: 201,
        description: ClubMessage.CREATED,
        type: ClubResponse
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
    async createClub(@Body() createClubDto: CreateClubDto) {
        const club = await this.clubService.createClub(createClubDto);

        return club
    }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Get all clubs' })
    @ApiResponse({
        status: 200,
        description: ClubMessage.GET_ALL_CLUBS,
        type: [ClubResponse]
    })
    async getClubs() {
        const clubs = await this.clubService.getClubs();

        return clubs
    }

    @Get(':clubId')
    @Public()
    @ApiOperation({ summary: 'Get club' })
    @ApiResponse({
        status: 200,
        description: ClubMessage.GET_CLUB,
        type: ClubResponse
    })
    @ApiResponse({
        status: 404,
        description: ClubMessage.NOT_FOUND,
    })
    async getClubById(@Param('clubId') clubId: string) {
        const club = await this.clubService.getClubById(clubId);

        return club
    }

    @Put(':clubId')
    @RequirePermission('club', PermissionAction.UPDATE)
    @ApiOperation({ summary: 'Update club', description: 'Returns the updated club' })
    @ApiResponse({
        status: 200,
        description: ClubMessage.UPDATED,
        type: ClubResponse
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
        description: ClubMessage.NOT_FOUND,
    })
    async updateClub(@Param('clubId') clubId: string, @Body() updateClubDto: UpdateClubDto) {
        const club = await this.clubService.updateClub(clubId, updateClubDto);

        return club
    }

    @Delete(':clubId')
    @HttpCode(204)
    @RequirePermission('club', PermissionAction.DELETE)
    @ApiOperation({ summary: 'Delete club', description: 'Returns the deleted message' })
    @ApiResponse({
        status: 204,
        description: ClubMessage.DELETED,
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
        description: ClubMessage.NOT_FOUND,
    })
    async deleteClub(@Param('clubId') clubId: string) {
        const result = await this.clubService.deleteClub(clubId);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result
    }
}
