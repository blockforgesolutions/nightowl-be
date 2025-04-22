import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { hashPassword } from 'src/utils/jwt.util';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserResponse } from './model/user.response';
import { AuthMessages } from 'src/common/enums/response/messages.enum';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { UserMessages } from './enums/user.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
        const user = await this.userModel.findOne({
            $or: [
                { email: createUserDto.email },
                { phoneNumber: createUserDto.phoneNumber }
            ]
        });

        if (user) {
            throw new HttpException(UserMessages.EMAIL_ALREADY_REGISTERED, HttpStatus.CONFLICT)
        }

        const hashedPassword = await hashPassword(createUserDto.password);
        createUserDto.password = hashedPassword;
        const newUser = await this.userModel.create(createUserDto);

        return await this.mapToUserResponse(newUser);
    }

    async getUsers(): Promise<UserResponse[]> {
        const users = await this.userModel.find()
            .select('-password')
            .populate({
                path: 'role',
                select: '_id name'
            })
            .lean();

        const transformedUsers = transformMongoArray<UserModel, UserResponse>(users);

        return transformedUsers
    }

    async getUserById(id: string): Promise<UserResponse> {
        const user = await this.userModel.findById(id);
           

        if (!user) {
            throw new HttpException(UserMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return await this.mapToUserResponse(user);
    }

    async getUserByEmail(email: string): Promise<UserModel> {
        const user = await this.userModel.findOne({ email: email })

        if (!user) {
            throw new HttpException(UserMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return user as UserModel
    }

    async getUserByPhoneNumber(phoneNumber: string): Promise<UserResponse> {
        const user = await this.userModel.findOne({ phoneNumber: phoneNumber })

        if (!user) {
            throw new HttpException(UserMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return await this.mapToUserResponse(user);
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
        const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true });
        if (!user) {
            throw new HttpException(UserMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return await this.mapToUserResponse(user);
    }

    async deleteUser(id: string): Promise<any> {
        const user = await this.userModel.findByIdAndDelete(id);
        if (!user) {
            throw new HttpException(UserMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return { message: UserMessages.DELETED };
    }

    private async mapToUserResponse(user: UserModel): Promise<UserResponse> {

        // Populate role and privileges
        const populatedUser = await this.userModel
            .findById(user._id)
            .select('-password')
            .populate([
                {
                    path: 'role',
                    select: '_id name'
                },
            ])
            .lean();

        if (!populatedUser || !populatedUser.role) {
            throw new NotFoundException(AuthMessages.USER_OR_ROLE_NOT_FOUND);
        }

        const transformedUser = transformMongoData(populatedUser, UserResponse);

        if (!transformedUser) {
            throw new Error('Failed to transform user document');
        }

        return transformedUser;
    }
}
