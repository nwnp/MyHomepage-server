import { CalendarsDao } from './../../calendars/dao/calendars.dao';
import { Post } from './../../common/databases/posts.entity';
import { ERROR } from './../../common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostRegisterModel } from '../models/post.register.model';
import { PostUpdateModel } from '../models/post.update.model';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from 'src/common/databases/post-comment.entity';
import { PostCommentsModel } from '../models/post.comments.model';
import { PostCommentUpdateModel } from '../models/post-comment.update.model';
import { PostCommentRegisterModel } from '../models/post-comment.register.model';
import { LimitedPostsModel } from '../models/limited.post.model';

@Injectable()
export class PostsDao {
  private readonly logger = new Logger('POST-DB');
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    private readonly dataSource: DataSource,
    private readonly calendarsDao: CalendarsDao,
  ) {}

  async getPostById(id: number): Promise<Post> {
    try {
      const post = await this.postsRepository.findOne({ where: { id } });
      return post;
    } catch (error) {
      this.logger.error('POST FINDONE ERROR');
      console.error(error);
      return;
    }
  }

  async getPostCommentById(id: number): Promise<PostComment> {
    try {
      const postComment = await this.postCommentRepository.findOne({
        where: { id },
      });
      return postComment;
    } catch (error) {
      this.logger.error('POST-COMMENT FINDONE ERROR');
      console.error(error);
    }
  }

  async getPostWithComment(
    info: PostCommentsModel,
  ): Promise<PostComment[] | Error> {
    try {
      const post = await this.dataSource
        .getRepository(PostComment)
        .createQueryBuilder('postComment')
        .leftJoinAndSelect('postComment.post', 'post')
        .leftJoinAndSelect('postComment.user', 'user')
        .where('postComment.PostId = :id', { id: ~~info.PostId })
        .getMany();
      return post;
    } catch (error) {
      this.logger.error('GetPostWithComment ERROR');
      console.error(error);
      return new GraphQLError('GET POSTS ERROR', ERROR.GET_POST_COMMENTS_ERROR);
    }
  }

  async getLimitedPosts(post: LimitedPostsModel): Promise<Post[]> {
    try {
      const posts = await this.dataSource
        .getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .where('post.UserId = :UserId', { UserId: post.UserId })
        .orderBy('post.id', 'DESC')
        .limit(post.count)
        .getMany();
      return posts;
    } catch (error) {
      console.error(error);
    }
  }

  async updatePostComment(
    info: PostCommentUpdateModel,
  ): Promise<boolean | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to update post-comment');
      const post = await this.dataSource
        .createQueryBuilder()
        .update(PostComment)
        .set({
          post_comment: info.comment,
        })
        .where('id = :id', { id: info.id })
        .execute();
      this.logger.verbose('Success to update post-comment');
      if (post.affected) {
        await queryRunner.commitTransaction();
        return true;
      } else return false;
    } catch (error) {
      this.logger.error('TRANSACTION ERROR');
      console.error(error);
      return new GraphQLError('SERVER ERROR', ERROR.UPDATE_POST_COMMENT_ERROR);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Release transaction to update post-comment');
    }
  }

  async registerPostComment(
    info: PostCommentRegisterModel,
  ): Promise<boolean | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start Transaction to register post-comment');
      const newComment = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(PostComment)
        .values({
          post_comment: info.comment,
          CommentedUserId: info.UserId,
          PostId: info.PostId,
        })
        .execute();
      this.logger.verbose('Success to register post-comment');
      if (newComment.generatedMaps.length) {
        await queryRunner.commitTransaction();
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error('Transaction ERROR');
      console.error(error);
      await queryRunner.rollbackTransaction();
      this.logger.verbose('Rollback Transaction');
      return new GraphQLError('SERVER ERROR', ERROR.REGISTER_POST_COMMENT);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released Transaction to register post-comment');
    }
  }

  async deletePostComment(commentId: number): Promise<boolean | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to delete post-comment');
      const deletedPostComment = await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(PostComment)
        .where('id = :id', { id: commentId })
        .execute();
      this.logger.verbose('Success transaction to delete post-comment');
      if (deletedPostComment.affected) {
        await queryRunner.commitTransaction();
        return true;
      } else return false;
    } catch (error) {
      this.logger.error('Transaction ERROR');
      console.error(error);
      await queryRunner.rollbackTransaction();
      this.logger.verbose('Rollback Transaction');
      return new GraphQLError('SERVER ERROR', ERROR.DELETE_POST_COMMENT);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Release Transaction to delete post-comment');
    }
  }

  async deleteAllPostCommentById(PostId: number): Promise<boolean> {
    try {
      const deleted = await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(PostComment)
        .where('PostId = :PostId', { PostId })
        .execute();
      return deleted.affected ? true : false;
    } catch (error) {
      throw new GraphQLError('ALL DELETE POST-COMMENT ERROR');
    }
  }

  async getPostsByUserId(UserId: number): Promise<Post[]> {
    try {
      const posts = await this.dataSource
        .getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .where('post.UserId = :UserId', { UserId })
        .orderBy('post.createdAt', 'DESC')
        .getMany();
      this.logger.verbose('Get posts success');
      return posts;
    } catch (error) {
      this.logger.error('Transaction ERROR');
      console.error(error);
      throw new GraphQLError('SERVER ERROR', ERROR.GET_POST_ERROR);
    }
  }

  async register(post: PostRegisterModel): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start Transaction to register post');
      const newPost = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Post)
        .values({
          UserId: post.UserId,
          title: post.title,
          content: post.content,
        })
        .execute();
      this.logger.verbose('Success transaction');
      await queryRunner.commitTransaction();
      return newPost.generatedMaps[0];
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Transaction ERROR');
      console.error(error);
      throw new GraphQLError('SERVER ERROR', ERROR.REGISTER_POST_ERROR);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released Transaction for register post');
    }
  }

  async update(post: PostUpdateModel): Promise<boolean | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to update post');
      const updatedPost = await this.dataSource
        .createQueryBuilder()
        .update(Post)
        .set({
          title: post.title,
          content: post.content,
        })
        .where('id = :id', { id: post.PostId })
        .execute();
      if (updatedPost.affected) {
        await queryRunner.commitTransaction();
        return true;
      } else return false;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Transaction ERROR');
      console.error(error);
      return new GraphQLError('SERVER ERROR', ERROR.UPDATE_ERROR);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released transaction to update post');
    }
  }

  async delete(id: number): Promise<boolean | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to delete post');
      await this.deleteAllPostCommentById(id);
      await this.calendarsDao.deleteByPostId(id);
      const deletedPost = await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Post)
        .where('id = :id', { id })
        .execute();
      await queryRunner.commitTransaction();
      return deletedPost.affected ? true : false;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Transaction ERROR');
      console.error(error);
      return new GraphQLError('SERVER ERROR', ERROR.DELETE_POST);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released transaction to delete post');
    }
  }
}
