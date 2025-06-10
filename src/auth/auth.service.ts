import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { isValidPassword } from 'src/utils/jwt.util';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { RoleService } from 'src/role/role.service';
import { AuthResponse } from './model/auth.response';
import { CreateEmployeeDto } from 'src/employee/dto/createEmployee.dto';
import { EmployeeAuthResponse } from './model/employee.response';
import { EmployeeModel } from 'src/employee/employee.schema';
import { EmployeeResponse } from 'src/employee/model/employee.response';
import { AuthMessages } from 'src/common/enums/response/messages.enum';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmployeeService } from 'src/employee/employee.service';
import { UserModel } from 'src/user/user.schema';
import { UserResponse } from 'src/user/model/user.response';



@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        @InjectModel(EmployeeModel.name) private readonly employeeModel: Model<EmployeeModel>,
        @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
        private readonly roleService: RoleService,
        private readonly employeeService: EmployeeService,
        private readonly jwtService: JwtService,
        private config: ConfigService
    ) { }

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const user = await this.userService.getUserByEmail(loginDto.email);

        if (!user) {
            throw new HttpException('user not found!', HttpStatus.NOT_FOUND)
        }

        const isMatch = await isValidPassword(loginDto.password, user.password);
        console.log(isMatch);

        if (!isMatch) {
            throw new HttpException('Username or password does not match', HttpStatus.UNAUTHORIZED);
        }

        const role = await this.roleService.getRoleById(String(user.role));

        user.lastEntry = new Date();
        await user.save();

        const token = await this.getTokens(String(user._id), role.name)
        const mappedUser = await this.mapToUserResponse(user);
        return { ...token, user: mappedUser };
    }

    async register(registerDto: CreateUserDto): Promise<AuthResponse> {
        const user = await this.userService.createUser(registerDto);

        const role = await this.roleService.getRoleById(String(user.role));

        const tokens = await this.getTokens(String(user.id), role.name);

        return {
            ...tokens,
            user
        };
    }

    async employeeLogin(login: LoginDto): Promise<EmployeeAuthResponse> {
        const employee = await this.employeeModel.findOne({ email: login.email });
        if (!employee) {
            throw new HttpException('user not found!', HttpStatus.NOT_FOUND)
        }

        const isMatch = await isValidPassword(login.password, employee.password);
        if (!isMatch) {
            throw new HttpException('Username or password does not match', HttpStatus.UNAUTHORIZED);
        }

        const role = await this.roleService.getRoleById(String(employee.role));

        employee.lastEntry = new Date();
        await employee.save();

        const token = await this.getTokens(String(employee._id), role.name)
        const mappedEmployee = await this.mapToEmployeeResponse(employee);
        return { ...token, employee: mappedEmployee };
    }

    async registerEmployee(registerDto: CreateEmployeeDto): Promise<EmployeeAuthResponse> {
        const employee = await this.employeeService.createEmployee(registerDto);

        const role = await this.roleService.getRoleById(String(employee.role));

        const tokens = await this.getTokens(String(employee.id), role.name);

        return {
            ...tokens,
            employee
        };
    }

    private async getTokens(userId: string, userRole?: string): Promise<{ access_token: string, refresh_token: string }> {
        const jwtPayload = {
            sub: userId,
            role: userRole
        };

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
                expiresIn: '4h',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
                expiresIn: '7d',
            })
        ])

        return {
            access_token,
            refresh_token
        }
    }

    private async mapToEmployeeResponse(employee: EmployeeModel): Promise<EmployeeResponse> {

        // Populate role and privileges
        const populatedEmployee = await this.employeeModel.findById(String(employee._id))
            .select('-password')
            .populate([
                {
                    path: 'role',
                    select: '_id name'
                },
                {
                    path: 'club',
                    select: 'id name country city district neighborhood street no address zipCode'
                }
            ])
            .lean();

        if (!populatedEmployee || !populatedEmployee.role) {
            throw new NotFoundException(AuthMessages.USER_OR_ROLE_NOT_FOUND);
        }

        const transformedEmployee = transformMongoData(populatedEmployee, EmployeeResponse);

        if (!transformedEmployee) {
            throw new Error('Failed to transform user document');
        }

        return transformedEmployee;
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
