import { Post } from './../../common/databases/posts.entity';
import { ERROR } from './../../common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PostRegisterModel } from '../models/post.register.model';

@Injectable()
export class PostsDao {
  private readonly logger = new Logger('POST-DB');
  constructor(private readonly dataSource: DataSource) {}

  async getPostByUserId(UserId: number): Promise<Post[]> {
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
}
