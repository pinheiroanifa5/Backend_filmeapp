import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto, UserResponse } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { throwError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

 async findAll() {
    const users= await this.prisma.user.findMany()
    return users.map((user) => {
      return UserResponse.create(user)
    })
  }
  async findOne(userId:number){
    const user = await this.prisma.user.findUnique({
      where:{
        id: userId
      }
    })

    if (!user) throw new NotFoundException("User not found")


    return UserResponse.create(user)
  }
 

  async editUser(
    userId: number,
    dto: UpdateUserDto,
  ) {

    if(dto.password){
     const  hashedPassword = await argon2.hash(dto.password)
      dto.password = hashedPassword
      
    }
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

  

    return user;
  }

  async delete(id:number){
    try {
      await this.prisma.user.delete({
        where: {id}
      })

      const message="User sucessfully deleted"

      return message
      
    } catch (error) {
      throw error
    }
    

  }
}
