import { ERROR } from 'src/common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { UsersDao } from '../../users/dao/users.dao';
import { FollowsDao } from '../dao/follows.dao';
import { Injectable } from '@nestjs/common';
import { FollowingRegister } from '../models/following.register.model';
import { FollowListType, FollowsForLogin } from 'src/common/types';
import { Follow } from 'src/common/databases/follows.entity';

@Injectable()
export class FollowsService {
  constructor(
    private readonly followsDao: FollowsDao,
    private readonly usersDao: UsersDao,
  ) {}

  async followsForLogin(FollowingId: number): Promise<FollowsForLogin> {
    return await this.followsDao.followsForLogin(FollowingId);
  }

  async followList(userId: number, type: FollowListType): Promise<Follow[]> {
    return type === 'followingMe'
      ? await this.followsDao.followingMe(userId)
      : await this.followsDao.imFollowing(userId);
  }

  // Header token UserId가 다른 UserId를 following
  async registerFollowing(info: FollowingRegister): Promise<boolean | Error> {
    const isExistUser = await this.usersDao.getUserById(info.FollowerId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);
    const checkFollow = await this.followsDao.checkFollow(info);
    return checkFollow
      ? await this.followsDao.registerUnfollowing(info)
      : await this.followsDao.registerFollowing(info);
  }

  async followCheck(userId: number, visitUserId: number): Promise<boolean> {
    return await this.followsDao.followCheck(userId, visitUserId);
  }
}
