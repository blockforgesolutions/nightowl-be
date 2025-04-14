import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthMessages } from 'src/common/enums/response/messages.enum';
import { AuthResponse } from './model/auth.response';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('login')
    @ApiOperation({ summary: "Sign in with email and password" })
    @ApiResponse({ status: 200, description: AuthMessages.LOGIN_SUCCESS, type: AuthResponse })
    @ApiResponse({ status: 401, description: AuthMessages.INVALID_CREDENTIALS })
    async login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginDto) {
        const tokens = await this.authService.login(loginDto);
        // res.cookie('accessToken', tokens.access_token, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: 'strict',
        //     // maxAge: 15 * 60 * 1000
        // });
        // res.cookie('refreshToken', tokens.refresh_token, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: 'strict',
        //     // maxAge: 7 * 24 * 60 * 60 * 1000 
        // });
        return tokens
    }

    @Post('register')
    @ApiOperation({ summary: "Sign up with email and password" })
    @ApiResponse({ status: 201, description: AuthMessages.USER_CREATED_SUCCESS, type: AuthResponse })
    @ApiResponse({ status: 400, description: AuthMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 409, description: AuthMessages.EMAIL_ALREADY_REGISTERED })
    async register(@Res({ passthrough: true }) res: Response, @Body() createUserDto: CreateUserDto) {
        const tokens = await this.authService.register(createUserDto);
        // res.cookie('accessToken', tokens.access_token, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: 'strict',
        //     // maxAge: 15 * 60 * 1000
        // });
        // res.cookie('refreshToken', tokens.refresh_token, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: 'strict',
        //     // maxAge: 7 * 24 * 60 * 60 * 1000 
        // });
        return tokens
    }
}
