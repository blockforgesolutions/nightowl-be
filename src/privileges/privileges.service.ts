import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PrivilegeDocument, PrivilegeModel } from './privilege.schema';
import { Model } from 'mongoose';
import { PrivilegeDto } from './dto/create-privilege.dto';
import { PrivilegeResponse } from './model/privilege.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { PrivilegeMessage } from './enums/privilege-message.enum';

@Injectable()
export class PrivilegesService {
    constructor(
        @InjectModel(PrivilegeModel.name) private readonly privilegeModel: Model<PrivilegeModel>,
    ) { }

    async createPrivilege(userId:string, privilege: PrivilegeDto): Promise<PrivilegeResponse> {
        const createdPrivilege = await this.privilegeModel.create({ ...privilege, createdBy: userId });
        const transformedPrivilege = transformMongoData(createdPrivilege.toObject(), PrivilegeResponse);
        return transformedPrivilege;
    }

    async getPrivileges(): Promise<PrivilegeResponse[]> {
        const privileges = await this.privilegeModel.find()
        .populate({
            path:'createdBy',
            select:'id fullName club',
            populate: {
                path:'club',
                select:'id name'
            }
        })
        .lean();

        const transformedPrivileges = transformMongoArray<PrivilegeDocument, PrivilegeResponse>(privileges);

        return transformedPrivileges
    }

    async getPrivilegeById(id: string): Promise<PrivilegeResponse> {
        const privilege = await this.privilegeModel.findById(id).lean();

        if (!privilege) {
            throw new HttpException(PrivilegeMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const transformedPrivilege = transformMongoData(privilege, PrivilegeResponse);

        return transformedPrivilege
    }

    async updatePrivilege(id: string, privilege: PrivilegeDto): Promise<PrivilegeResponse> {
        const updatedPrivilege = await this.privilegeModel.findByIdAndUpdate(id, privilege, { new: true }).lean();
        if (!updatedPrivilege) {
            throw new HttpException(PrivilegeMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const transformedPrivilege = transformMongoData(updatedPrivilege, PrivilegeResponse);

        return transformedPrivilege
    }

    async deletePrivilege(id: string): Promise<{ message: string }> {
        const deletedPrivilege = await this.privilegeModel.findByIdAndDelete(id);

        if (!deletedPrivilege) {
            throw new HttpException(PrivilegeMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return { message: PrivilegeMessage.DELETED }

    }
}
