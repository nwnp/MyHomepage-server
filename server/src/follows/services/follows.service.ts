import { ERROR } from 'src/common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { UsersDao } from './../../users/dao/users.dao';
import { FollowsDao } from './../dao/follows.dao';
import { Injectable } from '@nestjs/common';
import { FollowingRegister } from '../models/following.register.model';

@Injectable()
export class FollowsService {
  constructor(
    private readonly followsDao: FollowsDao,
    private readonly usersDao: UsersDao,
  ) {}

  // Header token UserId가 다른 UserId를 following
  async registerFollowing(info: FollowingRegister): Promise<boolean | Error> {
    const isExistUser = await this.usersDao.getUserById(info.FollowerId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);
    // 이미 팔로우를 하고 있으면 unfollow
    // 팔로우를 하고 있지 않으면 follow
    const checkFollow = await this.followsDao.checkFollow(info);
    return checkFollow
      ? await this.followsDao.registerUnfollowing(info)
      : await this.followsDao.registerFollowing(info);
  }
}
