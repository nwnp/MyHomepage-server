import { CommentRegisterModel } from './../models/comment.register.model';
import { CommentsDao } from './../dao/comments.dao';
import { Injectable } from '@nestjs/common';
import { Comment } from 'src/common/databases/comment.entity';
import { CommentUpdateModel } from '../models/comment.update.model';
import { CommentDeleteModel } from '../models/comment.delete.model';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsDao: CommentsDao) {}

  async registerComment(info: CommentRegisterModel): Promise<boolean | Error> {
    return await this.commentsDao.registerComment(info);
  }

  async getComments(UserId: number): Promise<Comment[] | Error> {
    return await this.commentsDao.getComments(UserId);
  }

  async updateComment(comment: CommentUpdateModel): Promise<boolean | Error> {
    return await this.commentsDao.updateComment(comment);
  }

  async deleteComment(comment: CommentDeleteModel): Promise<boolean | Error> {
    return await this.commentsDao.deleteComment(comment);
  }
}
