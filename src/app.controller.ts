import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './decorator/customize';

@Controller() //  route /
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private authService: AuthService

  ) { }

  // @Public()
  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // handleLogin(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  // // @UseGuards(JwtAuthGuard)
  // @Public()
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  // // @UseGuards(JwtAuthGuard)
  // @Get('profile1')
  // getProfile1(@Request() req) {
  //   return req.user;
  // }

}
