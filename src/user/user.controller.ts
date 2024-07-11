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

  constructor(private userService: UserService) { }

  @Get("all")
  @Roles(Role.ADMIN) // Get /users ou /users?role=value
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('/me') // GET /users/:id
  findOne(@GetUser("id") id: number) {
    return this.userService.findOne(id);
  }


  @Patch('/me') // PATCH /users/:id
  update(@Body() updateUserDto: UpdateUserDto, @GetUser("id") id: number) {
    return this.userService.editUser(id, updateUserDto);
  }

  @Delete(':id') // DELETE /users/:id
  @Roles(Role.ADMIN)
  async delete(@Param("id", ParseIntPipe) id: number) {
    return await this.userService.delete(id);
  }

}
