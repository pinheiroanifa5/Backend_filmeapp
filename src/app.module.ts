import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';


@Module({
  imports: [PrismaModule, 
    MoviesModule,
    ConfigModule.forRoot({
    isGlobal:true
  }), 
  UserModule, MoviesModule,AuthModule],
  controllers: [AppController],
  providers: [AppService, {
    provide:APP_GUARD,
    useClass:RolesGuard
  }],

})
export class AppModule {}
