import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from 'src/common/databases/users.entity';
import { UsersDao } from './dao/users.dao';
import { UserResolver } from './resolvers/users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersDao, UserResolver],
})
export class UsersModule {}
