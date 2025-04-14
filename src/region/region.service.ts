import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegionModel } from './region.schema';
import { Model } from 'mongoose';
import { CreateRegionDto } from './dto/createRegion.dto';
import { UpdateRegionDto } from './dto/updateRegion.dto';
import { RegionResponse } from './model/region.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { RegionMessages } from './enums/region.enum';

@Injectable()
export class RegionService {
    constructor(
        @InjectModel(RegionModel.name) private readonly regionModel: Model<RegionModel>
    ) { }

    async createRegion(createRegionDto: CreateRegionDto): Promise<RegionResponse> {
        const newRegion = await this.regionModel.create(createRegionDto);

        const transformedRegion = transformMongoData(newRegion, RegionResponse);

        return transformedRegion
    }

    async getRegionsByClub(clubId: string): Promise<RegionResponse[]> {
        const regions = await this.regionModel.find({ club: clubId }).lean();

        const transformedRegions = transformMongoArray<RegionModel, RegionResponse>(regions);

        return transformedRegions
    }

    async getRegionById(regionId: string): Promise<RegionResponse> {
        const region = await this.regionModel.findById(regionId).lean();

        if (!region) {
            throw new HttpException(RegionMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedRegion = transformMongoData(region, RegionResponse);

        return transformedRegion
    }

    async updateRegion(regionId: string, updateRegionDto: UpdateRegionDto): Promise<RegionResponse> {
        const region = await this.regionModel.findByIdAndUpdate(regionId, updateRegionDto, { new: true });

        if (!region) {
            throw new HttpException(RegionMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedRegion = transformMongoData(region, RegionResponse);

        return transformedRegion
    }

    async deleteRegion(regionId: string): Promise<any> {
        const region = await this.regionModel.findByIdAndDelete(regionId);

        if (!region) {
            throw new HttpException(RegionMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return { message: RegionMessages.DELETED };
    }

}
