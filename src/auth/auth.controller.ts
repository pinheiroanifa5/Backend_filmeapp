import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { AuthDto, SignUpDto } from './dto';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('signup')
    async signup(@Body() dto:SignUpDto) {
        return await this.authService.signup(dto);
    }


    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signin(@Body() dto: AuthDto) {
      return await this.authService.signin(dto);
    }

    }
  
  