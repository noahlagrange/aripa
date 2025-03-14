import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserResolver } from './user.resolver';
import { BoatModule } from 'src/boat/boat.module'; 
import { Boat } from 'src/boat/boat.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Boat]), 
    BoatModule, 
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
