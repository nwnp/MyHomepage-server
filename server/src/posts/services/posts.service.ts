import { ERROR } from './../../common/constant/error-handling';
import { Injectable } from '@nestjs/common';
import { Post } from 'src/common/databases/posts.entity';
import { PostsDao } from '../dao/posts.dao';
import { PostRegisterModel } from '../models/post.register.model';
import { PostUpdateModel } from '../models/post.update.model';
import { GraphQLError } from 'graphql';

@Injectable()
export class PostsService {
  constructor(private readonly postsDao: PostsDao) {}

  async getPostsByUserId(UserId: number): Promise<Post[]> {
    return await this.postsDao.getPostsByUserId(UserId);
  }

  async register(post: PostRegisterModel): Promise<any> {
    return await this.postsDao.register(post);
  }

  async update(post: PostUpdateModel): Promise<boolean | Error> {
    const isExistPost = await this.postsDao.getPostById(post.PostId);
    if (post.UserId != isExistPost.UserId)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);
    return await this.postsDao.update(post);
  }

  async delete(id: number): Promise<boolean | Error> {
    const isExistPost = await this.postsDao.getPostById(id);
    if (!isExistPost)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);
    return await this.postsDao.delete(id);
  }
}
