import { Controller, Post, UseGuards, Get, Body, Res, Req } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';


@Controller("auth") //  route /
export class AuthController {
    constructor(

        private authService: AuthService,
        private rolesService: RolesService

    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage("User login")
    @Post('/login')
    handleLogin(@Req() req,
        @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    @Public() // khong phai dung jwt 
    @ResponseMessage("resgister a new user ")
    @Post('/register')
    handleRegister(@Body() registerDto: RegisterUserDto) {
        return this.authService.register(registerDto);
    }

    @ResponseMessage("Get user information")
    @Get('/account')
    async handleGetAccount(@User() user: IUser) {


        const temp = await this.rolesService.findOne(user.role._id) as any;
        user.permissions = temp.permissions;
        return { user };
    }

    @Public()
    @ResponseMessage('Get User by refresh token')
    @Get('/refresh')
    handleRefreshToken(@Req() request: Request,
        @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies['refresh_token'];

        return this.authService.processNewToken(refreshToken, response);
    }

    @ResponseMessage("Logout User")
    @Post('/logout')
    handleLogout(
        @Res({ passthrough: true }) response: Response,
        @User() user: IUser
    ) {
        return this.authService.logout(response, user);
    }





    // @UseGuards(JwtAuthGuard)
    // @Public()
    // @Get('profile')
    // getProfile(@Request() req) {
    //     return req.user;
    // }

    // // @UseGuards(JwtAuthGuard)
    // @Get('profile1')
    // getProfile1(@Request() req) {
    //     return req.user;
    // }

}
