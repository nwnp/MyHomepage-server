import { UsersDao } from './../../users/dao/users.dao';
import { ERROR } from './../../common/constant/error-handling';
import { Injectable } from '@nestjs/common';
import { Post } from 'src/common/databases/posts.entity';
import { PostsDao } from '../dao/posts.dao';
import { PostRegisterModel } from '../models/post.register.model';
import { PostUpdateModel } from '../models/post.update.model';
import { GraphQLError } from 'graphql';
import { PostDeleteModel } from '../models/post.delete.model';
import { PostComment } from 'src/common/databases/post-comment.entity';
import { PostCommentsModel } from '../models/post.comments.model';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsDao: PostsDao,
    private readonly usersDao: UsersDao,
  ) {}
  async getPostsByUserId(UserId: number): Promise<Post[] | Error> {
    const isExistUser = await this.usersDao.getUserById(UserId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    return await this.postsDao.getPostsByUserId(UserId);
  }

  async getPostWithComment(
    info: PostCommentsModel,
  ): Promise<PostComment[] | Error> {
    const isExistUser = await this.usersDao.getUserById(info.UserId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    const isExistPost = await this.postsDao.getPostById(info.PostId);
    if (!isExistPost)
      return new GraphQLError('유효하지 않은 게시글', ERROR.INVALID_POST);

    return await this.postsDao.getPostWithComment(info);
  }

  async register(post: PostRegisterModel): Promise<any> {
    const isExistUser = await this.usersDao.getUserById(post.UserId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    return await this.postsDao.register(post);
  }

  async update(post: PostUpdateModel): Promise<boolean | Error> {
    const isExistUser = await this.usersDao.getUserById(post.UserId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    const isExistPost = await this.postsDao.getPostById(post.PostId);
    if (post.UserId != isExistPost.UserId)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    const updateContent = post.content ? post.content : null;
    const updateTitle = post.title ? post.title : null;

    post = {
      ...post,
      title: updateTitle,
      content: updateContent,
    };

    return await this.postsDao.update(post);
  }

  async delete(post: PostDeleteModel): Promise<boolean | Error> {
    const isExistUser = await this.usersDao.getUserById(post.UserId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    const isExistPost = await this.postsDao.getPostById(post.id);
    if (!isExistPost)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);
    return await this.postsDao.delete(post.id);
  }
}
