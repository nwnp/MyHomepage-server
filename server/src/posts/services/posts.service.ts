import { PostsDao } from './../dao/posts.dao';
import { Injectable } from '@nestjs/common';
import { Post } from 'src/common/databases/posts.entity';
import { PostRegisterModel } from '../models/post.register.model';

@Injectable()
export class PostsService {
  constructor(private readonly postsDao: PostsDao) {}

  async getPostsByUserId(UserId: number): Promise<Post[]> {
    return await this.postsDao.getPostByUserId(UserId);
  }

  async register(post: PostRegisterModel): Promise<any> {
    return await this.postsDao.register(post);
  }
}
