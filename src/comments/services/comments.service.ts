import { ERROR } from 'src/common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { CommentRegisterModel } from '../models/comment.register.model';
import { CommentsDao } from '../dao/comments.dao';
import { Injectable } from '@nestjs/common';
import { Comment } from 'src/common/databases/comment.entity';
import { CommentUpdateModel } from '../models/comment.update.model';
import { CommentDeleteModel } from '../models/comment.delete.model';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsDao: CommentsDao) {}

  async getComments(UserId: number): Promise<Comment[] | Error> {
    return await this.commentsDao.getComments(UserId);
  }

  async registerComment(
    info: CommentRegisterModel,
    commentedUserId: number,
  ): Promise<boolean | Error> {
    if (info.UserId == commentedUserId)
      return new GraphQLError('본인 방명록 등록 에러');

    return await this.commentsDao.registerComment(info, commentedUserId);
  }

  async updateComment(
    comment: CommentUpdateModel,
    commentedUserId: number,
  ): Promise<boolean | Error> {
    const isExistComment = await this.commentsDao.getCommentById(comment.id);
    if (!isExistComment)
      return new GraphQLError('SERVER ERROR', ERROR.INVALID_COMMENT_ERROR);

    if (commentedUserId !== comment.CommentedUserId)
      return new GraphQLError('INVALID USER', ERROR.INVALID_USER);

    if (comment.CommentedUserId != isExistComment.CommentedUserId)
      return new GraphQLError('INVALID USER', ERROR.INVALID_USER);

    return await this.commentsDao.updateComment(comment);
  }

  async deleteComment(
    commentInfo: CommentDeleteModel,
  ): Promise<boolean | Error> {
    const isExistComment = await this.commentsDao.getCommentById(
      commentInfo.id,
    );
    if (!isExistComment)
      return new GraphQLError('SERVER ERROR', ERROR.INVALID_COMMENT_ERROR);

    if (commentInfo.commentedUserId != isExistComment.CommentedUserId)
      return new GraphQLError('INVALID USER', ERROR.INVALID_USER);
    return await this.commentsDao.deleteComment(commentInfo.id);
  }
}
