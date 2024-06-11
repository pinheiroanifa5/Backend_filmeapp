import { Role, User } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsEnum(Role, {
        message: 'valid role required'
    })
    role: "ADMIN" | "user";
}


export class UserResponse {
   
    id: number

    name: string;
    
    email: string;

    role:Role

    public static create (user:User){
        const dto = new UserResponse()
        dto.id = user.id,
        dto.name = user.name,
        dto.email = user.email
        dto.role = user.role

        return dto
    }
}