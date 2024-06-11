import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { GetUser } from '../decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from '../user/dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorator/roles.decorator';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

  constructor(private userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN) // Get /users ou /users?role=value
  findAll() {
      return this.userService.findAll();
  }

  @Get('/me') // GET /users/:id
  findOne(@GetUser("id") id:number) {
      return this.userService.findOne(id);
  }


  @Patch('/me') // PATCH /users/:id
  update( @Body() updateUserDto: UpdateUserDto,@GetUser("id") id:number) {
      return this.userService.editUser(id, updateUserDto);
  }

  @Delete('/me') // DELETE /users/:id
  delete(@GetUser("id") id:number) {
      return this.userService.delete(id);
  }
}
