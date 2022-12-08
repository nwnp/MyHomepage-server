import { GraphQLError } from 'graphql';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/common/databases/comment.entity';
import { Repository, DataSource } from 'typeorm';
import { CommentRegisterModel } from '../models/comment.register.model';
import { ERROR } from 'src/common/constant/error-handling';
import { CommentUpdateModel } from '../models/comment.update.model';

@Injectable()
export class CommentsDao {
  private readonly logger = new Logger('COMMENT-DB');
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly dataSource: DataSource,
  ) {}

  async getCommentById(commentId: number): Promise<Comment> {
    try {
      const comment = await this.dataSource
        .getRepository(Comment)
        .createQueryBuilder('comment')
        .where('id = :id', { id: commentId })
        .getOne();
      return comment;
    } catch (error) {
      this.logger.error('SERVER ERROR');
      console.log(error);
    }
  }

  async registerComment(
    info: CommentRegisterModel,
    commentedUserId: number,
  ): Promise<boolean | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start Transaction to register comment');
      const newComment = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Comment)
        .values({
          comment: info.comment,
          UserId: info.UserId,
          CommentedUserId: commentedUserId,
          secret: info.secret,
        })
        .execute();
      const result = newComment.raw.affectedRows ? true : false;
      await queryRunner.commitTransaction();
      this.logger.verbose('Success to register comment');
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Transaction ERROR');
      console.error(error);
      return new GraphQLError('SERVER ERROR', ERROR.REGISTER_COMMENT_ERROR);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released Transaction to register comment');
    }
  }

  // 방명록 페이지의 userId를 받고 Read
  async getComments(UserId: number): Promise<Comment[] | Error> {
    try {
      const commentsWithUser = await this.dataSource
        .getRepository(Comment)
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .where('comment.UserId = :id', { id: UserId })
        .orderBy('comment.id', 'DESC')
        .getMany();
      return commentsWithUser;
    } catch (error) {
      this.logger.error('COMMENTS FINDALL ERROR');
      console.error(error);
      return new GraphQLError('SERVER ERROR', ERROR.GET_COMMENTS_ERROR);
    }
  }

  async updateComment(comment: CommentUpdateModel): Promise<boolean | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start Transaction to update comment');
      const newComment = await this.dataSource
        .createQueryBuilder()
        .update(Comment)
        .set({ comment: comment.comment })
        .where('id = :id', { id: comment.id })
        .execute();
      await queryRunner.commitTransaction();
      this.logger.verbose('Success to update comment');
      return newComment.affected ? true : false;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Transaction ERROR');
      console.error(error);
      return new GraphQLError('SERVER ERROR', ERROR.UPDATE_COMMENT_ERROR);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released Transaction to update comment');
    }
  }

  async deleteComment(commentId: number): Promise<boolean | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to delete comment');
      const result = await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Comment)
        .where('id = :id', { id: commentId })
        .execute();
      await queryRunner.commitTransaction();
      this.logger.verbose('Success to delete comment');
      return result.affected ? true : false;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Transaction ERROR');
      console.error(error);
      return new GraphQLError('SERVER ERROR', ERROR.DELETE_COMMENT_ERROR);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released transaction to delete comment');
    }
  }
}
