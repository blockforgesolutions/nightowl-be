import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClubDto } from './dto/create-club.dto';
import { ClubModel } from './club.model';
import { ClubResponse } from './model/club.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { UpdateClubDto } from './dto/update-club.dto';
import { ClubMessage } from 'src/club/enums/club-message.enum';

@Injectable()
export class ClubService {
    constructor(
        @InjectModel(ClubModel.name) private readonly clubModel: Model<ClubModel>
    ) { }

    async createClub(createClubDto: CreateClubDto): Promise<ClubResponse> {
        const newClub = await this.clubModel.create(createClubDto);

        const trasformedClub = transformMongoData(newClub, ClubResponse);

        return trasformedClub;
    }

    async getClubs(): Promise<ClubResponse[]> {
        const clubs = await this.clubModel.find().lean();

        const transformedClubs = transformMongoArray(clubs);

        return transformedClubs;
    }

    async getClubById(clubId: string): Promise<ClubResponse> {
        const club = await this.clubModel.findById(clubId).lean();

        if (!club) {
            throw new HttpException(ClubMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const trasformedClub = transformMongoData(club, ClubResponse);

        return trasformedClub;
    }

    async updateClub(clubId: string, updateClubDto: UpdateClubDto): Promise<ClubResponse> {
        const club = await this.clubModel.findByIdAndUpdate(clubId, updateClubDto, { new: true });

        if (!club) {
            throw new HttpException(ClubMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const trasformedClub = transformMongoData(club, ClubResponse);

        return trasformedClub;
    }

    async deleteClub(clubId: string): Promise<any> {
        const company = await this.clubModel.findByIdAndDelete(clubId);

        if (!company) {
            throw new HttpException(ClubMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return { message: ClubMessage.DELETED};
    }
}
