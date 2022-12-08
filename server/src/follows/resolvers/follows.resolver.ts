import { FollowListModel } from './../models/follow.list.model';
import { ERROR } from 'src/common/constant/error-handling';
import { User } from 'src/common/databases/users.entity';
import { GqlAuthGuard } from './../../auth/guard/gql.auth.guard';
import { FollowsService } from './../services/follows.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/functions/current.user';
import { FollowsForLogin } from 'src/common/types';
import { Follow } from 'src/common/databases/follows.entity';
import { GraphQLError } from 'graphql';

@Resolver('Follow')
export class FollowsResolver {
  constructor(private readonly followsService: FollowsService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async followsForLogin(@Args('id') id: number): Promise<FollowsForLogin> {
    return await this.followsService.followsForLogin(id);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async followList(
    @Args('info') info: FollowListModel,
  ): Promise<Follow[] | Error> {
    return info.type === 'followingMe'
      ? await this.followsService.followList(info.userId, 'followingMe')
      : info.type !== 'imFollowing'
      ? new GraphQLError('SERVER', ERROR.FOLLOWING('INVALID_TYPE'))
      : await this.followsService.followList(info.userId, 'imFollowing');
  }

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
