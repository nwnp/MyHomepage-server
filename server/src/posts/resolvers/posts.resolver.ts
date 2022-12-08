import { GqlAuthGuard } from './../../auth/guard/gql.auth.guard';
import { PostsService } from './../services/posts.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Post } from 'src/common/databases/posts.entity';
import { PostRegisterModel } from '../models/post.register.model';
import { PostUpdateModel } from '../models/post.update.model';
import { PostDeleteModel } from '../models/post.delete.model';
import { PostComment } from 'src/common/databases/post-comment.entity';
import { PostCommentsModel } from '../models/post.comments.model';
import { PostCommentRegisterModel } from '../models/post-comment.register.model';
import { PostCommentDeleteModel } from '../models/post-comment.delete.model';
import { PostCommentUpdateModel } from '../models/post-comment.update.model';
import { LimitedPostsModel } from '../models/limited.post.model';
import { CurrentUser } from 'src/common/functions/current.user';
import { User } from 'src/common/databases/users.entity';

@Resolver('post')
export class PostResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [Post])
  @UseGuards(GqlAuthGuard)
  async getPostsByUserId(@Args('id') id: string): Promise<Post[] | Error> {
    return await this.postsService.getPostsByUserId(parseInt(id));
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async getPostWithComment(
    @Args('info') info: PostCommentsModel,
  ): Promise<PostComment[] | Error> {
    return await this.postsService.getPostWithComment(info);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async getLimitedPosts(
    @Args('post') post: LimitedPostsModel,
    @CurrentUser() user: User,
  ) {
    return await this.postsService.getLimitedPosts(post);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async registerPost(@Args('post') post: PostRegisterModel): Promise<any> {
    return await this.postsService.register(post);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('post') post: PostUpdateModel,
  ): Promise<boolean | Error> {
    return await this.postsService.update(post);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePost(
    @Args('post') post: PostDeleteModel,
  ): Promise<boolean | Error> {
    return await this.postsService.delete(post);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async registerPostComment(@Args('post') post: PostCommentRegisterModel) {
    return await this.postsService.registerPostComment(post);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePostComment(
    @Args('post') post: PostCommentDeleteModel,
  ): Promise<boolean | Error> {
    return await this.postsService.deletePostComment(post);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updatePostComment(
    @Args('post') post: PostCommentUpdateModel,
  ): Promise<boolean | Error> {
    return await this.postsService.updatePostComment(post);
  }
}
