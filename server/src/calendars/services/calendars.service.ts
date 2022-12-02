import { Length } from 'class-validator';
import { Calendar } from 'src/common/databases/calendars.entity';
import { UsersDao } from './../../users/dao/users.dao';
import { ERROR } from 'src/common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { PostsDao } from './../../posts/dao/posts.dao';
import { CalendarsDao } from './../dao/calendars.dao';
import { Injectable } from '@nestjs/common';
import { CalRegisterModel } from '../models/calendar.register.model';

@Injectable()
export class CalendarsService {
  constructor(
    private readonly calendarsDao: CalendarsDao,
    private readonly postsDao: PostsDao,
    private readonly usersDao: UsersDao,
  ) {}

  async registerPostInCal(info: CalRegisterModel): Promise<boolean | Error> {
    const isExistPost = await this.postsDao.getPostById(info.PostId);
    if (!isExistPost) {
      return new GraphQLError(
        '유효하지 않은 게시글 ID',
        ERROR.POST('INVALID_POST_ID'),
      );
    }

    const isExistUser = await this.usersDao.getUserById(info.UserId);
    if (!isExistUser) {
      return new GraphQLError(
        '유효하지 않은 회원',
        ERROR.USER('INVALID_USER_ID'),
      );
    }

    if (isExistUser.id != isExistPost.UserId) {
      return new GraphQLError(
        '다른 유저의 게시글은 등록할 수 없습니다.',
        ERROR.CALENDAR('INVALID_USERID_AND_POSTID'),
      );
    }

    const isExist: Calendar = await this.calendarsDao.checkPostInCal(info);
    const bool = isExist.id ? true : false;
    if (bool)
      return new GraphQLError(
        '이미 등록된 게시글',
        ERROR.CALENDAR('ALREDAY_REGISTERED_POST'),
      );

    return await this.calendarsDao.registerPostInCal(info);
  }
}
