

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { Role } from '@prisma/client';
import { authorize } from 'passport';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { PayloadData } from 'src/user/dto/user.dto';

@Injectable()

export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private config: ConfigService) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!requiredRoles) {

      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authorizationHeader: string = request.headers['authorization'];
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.substring(7);
      const decodedToken: any = jwt.verify(
        token,
        this.config.get('JWT_SECret')
      )
      const user = decodedToken as PayloadData
      return requiredRoles.some(role => user.role.includes(role));
    }
    return false
  }

}
