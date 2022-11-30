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
    return this.followsDao.registerFollowing(info);
  }
}
