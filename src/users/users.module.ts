import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { AuthService } from "./auth.service";
import { CurrentUserInterceptor } from "./interceptor/current-user.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService,AuthService,{
    provide:APP_INTERCEPTOR,
    useClass:CurrentUserInterceptor
  }],
  exports: [UsersService, AuthService],
})
export class UsersModule {}
