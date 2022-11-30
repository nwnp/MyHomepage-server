import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FollowsResolver } from './resolvers/follows.resolver';
import { FollowsService } from './services/follows.service';
import { Follow } from 'src/common/databases/follows.entity';
import { FollowsDao } from './dao/follows.dao';
import { User } from 'src/common/databases/users.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User]), UsersModule],
  providers: [FollowsResolver, FollowsService, FollowsDao],
})
export class FollowsModule {}
