import { GraphQLError } from 'graphql';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/common/databases/comment.entity';
import { Repository, DataSource } from 'typeorm';
import { CommentRegisterModel } from '../models/comment.register.model';
import { ERROR } from 'src/common/constant/error-handling';
import { CommentUpdateModel } from '../models/comment.update.model';
import { CommentDeleteModel } from '../models/comment.delete.model';

@Injectable()
export class CommentsDao {
  private readonly logger = new Logger('COMMENT-DB');
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly dataSource: DataSource,
  ) {}

  async registerComment(info: CommentRegisterModel): Promise<boolean | Error> {
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
          commentedUserId: info.commentedUserId,
        })
        .execute();
      const result = newComment.raw.affectedRows ? true : false;
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

  async deleteComment(comment: CommentDeleteModel): Promise<boolean | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to delete comment');
      const result = await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Comment)
        .where('id = :id', { id: comment.id })
        .execute();
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
