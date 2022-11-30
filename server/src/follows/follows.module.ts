import { Module } from '@nestjs/common';
import { FollowsResolver } from './resolvers/follows.resolver';
import { FollowsService } from './services/follows.service';

@Module({
  providers: [FollowsResolver, FollowsService],
})
export class FollowsModule {}
