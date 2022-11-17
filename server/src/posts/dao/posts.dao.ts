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

@Injectable()
export class PostsDao {
  private readonly logger = new Logger('POST-DB');
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    private readonly dataSource: DataSource,
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
      if (updatedPost.affected) return true;
      else return false;
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
      const deletedPost = await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Post)
        .where('id = :id', { id })
        .execute();
      if (deletedPost.affected) return true;
      else return false;
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
