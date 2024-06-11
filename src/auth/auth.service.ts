import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { AuthDto, SignUpDto } from './dto';
  //import * as argon from 'argon2';
  import * as argon2 from 'argon2';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Role } from '@prisma/client';
  
  @Injectable()
  export class AuthService {
    constructor(
      private prisma: PrismaService,
      private jwt: JwtService,
      private config: ConfigService,
    ) {}
  
    async signup(dto: SignUpDto) {
      try {
        // generate the password hash
      
        const hash = await argon2.hash(dto.password)
       
        // save the new user in the db
        const user = await this.prisma.user.create({
          data: {
            email:dto.email,
            name:dto.name,
            password: hash
          },
        });
  
        return this.signToken(user.id, user.email,user.role);
      } catch (error) {
        if (
          error instanceof
          PrismaClientKnownRequestError
        ) {
          if (error.code === 'P2002') {
            throw new ForbiddenException(
              'Credentials taken',
            );
          }
        }
        throw error;
      }
    }
  
    async signin(dto: AuthDto) {
      // find the user by email
      const user =
        await this.prisma.user.findUnique({
          where: {
            email: dto.email,
          },
        });
      // if user does not exist throw exception
      if (!user)
        throw new ForbiddenException(
          'Credentials incorrect',
        );
  
      // compare password
      const pwMatches = await argon2.verify(
        user.password,
        dto.password,
      );
      // if password incorrect throw exception
      if (!pwMatches)
        throw new ForbiddenException(
          'Credentials incorrect',
        );
      return this.signToken(user.id, user.email,user.role);
    }
  
    async signToken(
      userId: number,
      email: string,
      role:Role
    ): Promise<{ access_token: string }> {
      const payload = {
        sub: userId,
        email,
        role
      };
      const secret = this.config.get('JWT_SECRET');
  
      const token = await this.jwt.signAsync(
        payload,
        {
          //expiresIn: '15m',
          secret: secret,
        },
      );
  
      return {
        access_token: token,
      };
    }
  }
  