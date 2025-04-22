import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { isValidPassword } from 'src/utils/jwt.util';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { RoleService } from 'src/role/role.service';
import { AuthResponse } from './model/auth.response';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateEmployeeDto } from 'src/employee/dto/createEmployee.dto';



@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly employeeService: EmployeeService,
        private readonly roleService: RoleService,
        private readonly jwtService: JwtService,
        private config: ConfigService
    ) { }

    async login(loginDto: LoginDto): Promise<AuthResponse> {

        const user = await this.userService.getUserByEmail(loginDto.email);

        if (!user) {
            throw new HttpException('user not found!', HttpStatus.NOT_FOUND)
        }

        const isMatch = await isValidPassword(loginDto.password, user.password);
        if (!isMatch) {
            throw new HttpException('Username or password does not match', HttpStatus.UNAUTHORIZED);
        }

        const role = await this.roleService.getRoleById(String(user.role));

        user.lastEntry = new Date();
        await user.save();

        const token = await this.getTokens(String(user._id), role.name)
        return token;
    }

    async register(registerDto: CreateUserDto): Promise<AuthResponse> {
        const user = await this.userService.createUser(registerDto);

        const role = await this.roleService.getRoleById(String(user.role));

        const tokens = await this.getTokens(String(user.id), role.name);

        return tokens;
    }

    async employeeLogin(login: LoginDto): Promise<AuthResponse> {
        const employee = await this.employeeService.getEmployeeByEmail(login.email);

        const isMatch = await isValidPassword(login.password, employee.password);
        if (!isMatch) {
            throw new HttpException('Username or password does not match', HttpStatus.UNAUTHORIZED);
        }

        const role = await this.roleService.getRoleById(String(employee.role));

        employee.lastEntry = new Date();
        await employee.save();

        const token = await this.getTokens(String(employee._id), role.name)
        return token;
    }

    async registerEmployee(registerDto: CreateEmployeeDto): Promise<AuthResponse> {
        const employee = await this.employeeService.createEmployee(registerDto);

        const role = await this.roleService.getRoleById(String(employee.role));

        const tokens = await this.getTokens(String(employee.id), role.name);

        return tokens;
    }

    private async getTokens(userId: string, userRole?: string): Promise<AuthResponse> {
        const jwtPayload = {
            sub: userId,
            role: userRole
        };

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
                expiresIn: '15m',
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
}
