import { User } from 'src/common/databases/users.entity';
import { GqlAuthGuard } from './../../auth/guard/gql.auth.guard';
import { FollowsService } from './../services/follows.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/functions/current.user';

@Resolver('Follow')
export class FollowsResolver {
  constructor(private readonly followsService: FollowsService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async registerFollowing(
    @Args('followerId') followerId: number,
    @CurrentUser() user: User,
  ): Promise<boolean | Error> {
    return await this.followsService.registerFollowing({
      FollowerId: followerId,
      FollowingId: user.id,
    });
  }
}
