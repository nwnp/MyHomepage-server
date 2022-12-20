import { ERROR } from './../../common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { UsersDao } from './../../users/dao/users.dao';
import { FeedbacksDao } from './../dao/feedbacks.dao';
import { Injectable } from '@nestjs/common';
import { FeedbackRegisterModel } from '../models/feedback.register.model';

@Injectable()
export class FeedbacksService {
  constructor(
    private readonly feedbacksDao: FeedbacksDao,
    private readonly usersDao: UsersDao,
  ) {}

  async registerFeedback(feedback: FeedbackRegisterModel): Promise<boolean> {
    const isExistUser = await this.usersDao.getUserById(feedback.UserId);
    if (!isExistUser)
      throw new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    return await this.feedbacksDao.registerFeedback(feedback);
  }
}
