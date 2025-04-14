import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RoleDto } from './dto/role.dto';
import { RoleResponse } from './model/role.response';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { RoleMessages } from './enums/role.enum';
import { RoleDocument, RoleModel } from './role.schema';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(RoleModel.name) private readonly roleModel: Model<RoleModel>
    ) { }

    async createRole(roleDto: RoleDto): Promise<RoleResponse> {
        const newRole = await this.roleModel.create(roleDto);

        const transformedRole = transformMongoData(newRole.toObject(), RoleResponse);

        return transformedRole
    }

    async getRoles(): Promise<RoleResponse[]> {
        const roles = await this.roleModel.find()
            .populate('privileges', 'id name description action')
            .lean()

        const transformedRoles = transformMongoArray<RoleDocument, RoleResponse>(roles)

        return transformedRoles
    }

    async getRoleById(roleId: string): Promise<RoleResponse> {
        const role = await this.roleModel.findById(roleId)
            .populate('privileges', 'id name description action')
            .lean()

        if (!role) {
            throw new HttpException(RoleMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedRole = transformMongoData(role, RoleResponse)

        return transformedRole
    }

    async getRoleByName(name: string): Promise<RoleResponse> {
        const role = await this.roleModel.findOne({ name })
            .populate('privileges', 'id name description action')
            .lean()

        if (!role) {
            throw new HttpException(RoleMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedRole = transformMongoData(role, RoleResponse)

        return transformedRole
    }


    // auth:[1,2,3] => auth[1,3]
    async updateRole(roleId: string, roleDto: RoleDto): Promise<RoleResponse> {
        const role = await this.roleModel.findByIdAndUpdate(roleId, roleDto, { new: true })
            .populate('privileges', 'id name createdBy action')
            .lean();

        if (!role) {
            throw new HttpException(RoleMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const transformedRole = transformMongoData(role, RoleResponse)

        return transformedRole
    }

    async addPrivilege(roleId: string, privilegeId: string): Promise<RoleResponse> {
        const role = await this.roleModel.findById(roleId);

        if (!role) {
            throw new HttpException(RoleMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const privilegeObjectId = new Types.ObjectId(privilegeId);

        const exists = await this.roleModel.findOne({
            _id: roleId,
            privileges: { $in: [privilegeObjectId] }
        });

        if (exists) {
            throw new HttpException(RoleMessages.PRIVILEGE_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
        }

        const updatedRole = await this.roleModel.findByIdAndUpdate(
            roleId,
            { $push: { privileges: privilegeId } },
            { new: true }
        )
            .populate('privileges', 'id name createdBy action')
            .lean();

        if (!updatedRole) {
            throw new HttpException(RoleMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const transformedRole = transformMongoData(updatedRole, RoleResponse);
        return transformedRole;
    }

    async removePrivilege(roleId: string, privilegeId: string): Promise<RoleResponse> {
        const role = await this.roleModel.findById(roleId)

        if (!role) {
            throw new HttpException(RoleMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const privilegeObjectId = new Types.ObjectId(privilegeId);
        const exists = await this.roleModel.findOne({
            _id: roleId,
            privileges: { $in: [privilegeObjectId] }
        });

        if (!exists) {
            throw new HttpException(RoleMessages.PRIVILEGE_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }

        const updatedRole = await this.roleModel.findByIdAndUpdate(
            roleId,
            { $pull: { privileges: privilegeId } },
            { new: true }
        )
            .populate('privileges', 'id name createdBy action')
            .lean();

        if (!updatedRole) {
            throw new HttpException(RoleMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const transformedRole = transformMongoData(updatedRole, RoleResponse);
        return transformedRole;
    }

    async deleteRole(roleId: string): Promise<any> {
        const role = await this.roleModel.findByIdAndDelete(roleId);

        if (!role) {
            throw new HttpException(RoleMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return { message: RoleMessages.DELETED }
    }
}
