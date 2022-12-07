import { UsersDao } from './../../users/dao/users.dao';
import { ERROR } from './../../common/constant/error-handling';
import { Injectable } from '@nestjs/common';
import { Post } from 'src/common/databases/posts.entity';
import { PostsDao } from '../dao/posts.dao';
import { PostRegisterModel } from '../models/post.register.model';
import { PostUpdateModel } from '../models/post.update.model';
import { GraphQLError } from 'graphql';
import { PostComment } from 'src/common/databases/post-comment.entity';
import { PostCommentRegisterModel } from '../models/post-comment.register.model';
import { PostCommentDeleteModel } from '../models/post-comment.delete.model';
import { PostCommentUpdateModel } from '../models/post-comment.update.model';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsDao: PostsDao,
    private readonly usersDao: UsersDao,
  ) {}
  async getPostsByUserId(userId: number): Promise<Post[] | Error> {
    const isExistUser = await this.usersDao.getUserById(userId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    return await this.postsDao.getPostsByUserId(userId);
  }

  async getPostWithComment(
    postId: number,
    userId: number,
  ): Promise<PostComment[] | Error> {
    const isExistUser = await this.usersDao.getUserById(userId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    const isExistPost = await this.postsDao.getPostById(postId);
    if (!isExistPost)
      return new GraphQLError('유효하지 않은 게시글', ERROR.INVALID_POST);

    return await this.postsDao.getPostWithComment(postId);
  }

  async getLimitedPosts(count: number, userId: number): Promise<Post[]> {
    return await this.postsDao.getLimitedPosts(count, userId);
  }

  async registerPostComment(info: PostCommentRegisterModel, userId: number) {
    const isExistUser = await this.usersDao.getUserById(userId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    const isExistPost = await this.postsDao.getPostById(info.PostId);
    if (!isExistPost)
      return new GraphQLError('유효하지 않은 게시글', ERROR.INVALID_POST);

    return await this.postsDao.registerPostComment(info, userId);
  }

  async registerPost(post: PostRegisterModel, userId: number): Promise<any> {
    const isExistUser = await this.usersDao.getUserById(userId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    return await this.postsDao.registerPost(post, userId);
  }

  async updatePost(
    post: PostUpdateModel,
    userId: number,
  ): Promise<boolean | Error> {
    const isExistUser = await this.usersDao.getUserById(userId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    const isExistPost = await this.postsDao.getPostById(post.PostId);
    if (userId != isExistPost.UserId)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    const updateContent = post.content ? post.content : null;
    const updateTitle = post.title ? post.title : null;

    post = {
      ...post,
      title: updateTitle,
      content: updateContent,
    };

    return await this.postsDao.updatePost(post);
  }

  async deletePost(postId: number, userId: number): Promise<boolean | Error> {
    const isExistUser = await this.usersDao.getUserById(userId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    const isExistPost = await this.postsDao.getPostById(postId);
    if (!isExistPost)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);
    return await this.postsDao.deletePost(postId);
  }

  async deletePostComment(
    post: PostCommentDeleteModel,
    userId: number,
  ): Promise<boolean | Error> {
    const isExistUser = await this.usersDao.getUserById(userId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    const isExistPost = await this.postsDao.getPostById(post.PostId);
    if (!isExistPost)
      return new GraphQLError('유효하지 않은 게시글', ERROR.INVALID_USER);

    const isPostComment = await this.postsDao.getPostCommentById(
      post.commentId,
    );
    if (!isPostComment)
      return new GraphQLError('유효하지 않은 댓글', ERROR.GET_POST_COMMENT);

    if (isPostComment.CommentedUserId != userId)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    return await this.postsDao.deletePostComment(post.commentId);
  }

  async updatePostComment(
    post: PostCommentUpdateModel,
    userId: number,
  ): Promise<boolean | Error> {
    const isExistUser = await this.usersDao.getUserById(userId);
    if (!isExistUser)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    const isExistPost = await this.postsDao.getPostById(post.PostId);
    if (!isExistPost)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);

    return this.postsDao.updatePostComment(post);
  }
}
