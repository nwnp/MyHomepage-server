import { GqlAuthGuard } from './../../auth/guard/gql.auth.guard';
import { PostsService } from './../services/posts.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Post } from 'src/common/databases/posts.entity';
import { PostRegisterModel } from '../models/post.register.model';
import { PostUpdateModel } from '../models/post.update.model';
import { PostComment } from 'src/common/databases/post-comment.entity';
import { PostCommentRegisterModel } from '../models/post-comment.register.model';
import { PostCommentDeleteModel } from '../models/post-comment.delete.model';
import { PostCommentUpdateModel } from '../models/post-comment.update.model';
import { CurrentUser } from 'src/common/functions/current.user';
import { User } from 'src/common/databases/users.entity';

@Resolver('post')
export class PostResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [Post])
  @UseGuards(GqlAuthGuard)
  async getPostsByUserId(@CurrentUser() user: User): Promise<Post[] | Error> {
    return await this.postsService.getPostsByUserId(user.id);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async getPostWithComment(
    @Args('postId') postId: number,
    @CurrentUser() user: User,
  ): Promise<PostComment[] | Error> {
    return await this.postsService.getPostWithComment(postId, user.id);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async getLimitedPosts(
    @Args('count') count: number,
    @CurrentUser() user: User,
  ) {
    return await this.postsService.getLimitedPosts(count, user.id);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async registerPost(
    @Args('post') post: PostRegisterModel,
    @CurrentUser() user: User,
  ): Promise<any> {
    return await this.postsService.registerPost(post, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('post') post: PostUpdateModel,
    @CurrentUser() user: User,
  ): Promise<boolean | Error> {
    return await this.postsService.updatePost(post, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePost(
    @Args('postId') postId: number,
    @CurrentUser() user: User,
  ): Promise<boolean | Error> {
    return await this.postsService.deletePost(postId, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async registerPostComment(
    @Args('post') post: PostCommentRegisterModel,
    @CurrentUser() user: User,
  ) {
    return await this.postsService.registerPostComment(post, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePostComment(
    @Args('post') post: PostCommentDeleteModel,
    @CurrentUser() user: User,
  ): Promise<boolean | Error> {
    return await this.postsService.deletePostComment(post, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updatePostComment(
    @Args('post') post: PostCommentUpdateModel,
    @CurrentUser() user: User,
  ): Promise<boolean | Error> {
    return await this.postsService.updatePostComment(post, user.id);
  }
}
