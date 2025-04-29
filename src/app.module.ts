import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Report } from './reports/reports.entitry';

@Module({
  controllers: [AppController],
  imports: [TypeOrmModule.forRoot({
    type:'sqlite',
    database:'db.sqlite',
    entities: [User,Report],
    synchronize:true
  }),ReportsModule,UsersModule],
  providers:[AppService],
})
export class AppModule {}
