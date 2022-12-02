import { ERROR } from 'src/common/constant/error-handling';
import { User } from 'src/common/databases/users.entity';
import { GqlAuthGuard } from './../../auth/guard/gql.auth.guard';
import { FollowsService } from './../services/follows.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/functions/current.user';
import { FollowListType, FollowsForLogin } from 'src/common/types/follows';
import { Follow } from 'src/common/databases/follows.entity';
import { GraphQLError } from 'graphql';

@Resolver('Follow')
export class FollowsResolver {
  constructor(private readonly followsService: FollowsService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async followsForLogin(@CurrentUser() user: User): Promise<FollowsForLogin> {
    return await this.followsService.followsForLogin(user.id);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async followList(
    @Args('type') type: FollowListType,
    @CurrentUser() user: User,
  ): Promise<Follow[] | Error> {
    return type === 'followingMe'
      ? await this.followsService.followList(user.id, 'followingMe')
      : type !== 'imFollowing'
      ? new GraphQLError('SERVER', ERROR.FOLLOWING('INVALID_TYPE'))
      : await this.followsService.followList(user.id, 'imFollowing');
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
