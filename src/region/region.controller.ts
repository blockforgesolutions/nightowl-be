import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/createRegion.dto';
import { UpdateRegionDto } from './dto/updateRegion.dto';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { PermissionAction } from 'src/common/enums/permission.enum';
import { RegionMessages } from './enums/region.enum';
import { RegionResponse } from './model/region.response';
import { CommonMessage } from 'src/common/enums/response/common-message.enum';

@Controller('region')
@ApiTags('Region')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RegionController {
    constructor(
        private readonly regionService: RegionService
    ) { }

    @Post()
    @HttpCode(201)
    @RequirePermission('region', PermissionAction.CREATE)
    @ApiOperation({ summary: 'Create a new region', description: 'Returns the created region' })
    @ApiResponse({
        status: 201,
        description: RegionMessages.CREATED,
        type: RegionResponse
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
    async createRegion(@Body() createRegionDto: CreateRegionDto) {
        const region = await this.regionService.createRegion(createRegionDto);

        return region
    }

    @Get('/club/:clubId')
    @RequirePermission('region', PermissionAction.READ)
    @ApiOperation({ summary: 'Get all regions', description: 'Returns the list of regions' })
    @ApiResponse({
        status: 200,
        description: "Returns the list of regions",
        type: [RegionResponse]
    })
    @ApiResponse({
        status: 401,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: CommonMessage.UNAUTHORIZED_ACCESS
    })
    async getRegionsByCompany(@Param('clubId') clubId: string) {
        const regions = await this.regionService.getRegionsByClub(clubId);

        return regions
    }

    @Get(':regionId')
    @RequirePermission('region', PermissionAction.READ)
    @ApiOperation({ summary: 'Get single region', description: 'Returns the single region' })
    @ApiResponse({
        status: 200,
        description: "Returns the single region",
        type: RegionResponse
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
        description: RegionMessages.NOT_FOUND
    })
    async getRegionById(@Param("regionId") regionId: string) {
        const region = await this.regionService.getRegionById(regionId)

        return region
    }

    @Put(':regionId')
    @RequirePermission('region', PermissionAction.UPDATE)
    @ApiOperation({ summary: 'Update region', description: 'Returns the updated region' })
    @ApiResponse({
        status: 200,
        description: RegionMessages.UPDATED,
        type: RegionResponse
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
        description: RegionMessages.NOT_FOUND
    })
    async updateRegion(@Param("regionId") regionId: string, @Body() updateRegionDto: UpdateRegionDto) {
        const region = await this.regionService.updateRegion(regionId, updateRegionDto)

        return region
    }

    @Delete(':regionId')
    @RequirePermission('region', PermissionAction.DELETE)
    @ApiOperation({ summary: 'Delete a region', description: 'Returns the deleted message' })
    @ApiResponse({
        status: 200,
        description: RegionMessages.DELETED,
        type:String
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
        description: RegionMessages.NOT_FOUND
    })
    @HttpCode(204)
    async deleteRegion(@Param("regionId") regionId: string) {
        await this.regionService.deleteRegion(regionId)
    }
}
