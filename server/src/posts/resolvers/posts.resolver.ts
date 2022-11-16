import { GqlAuthGuard } from './../../auth/guard/gql.auth.guard';
import { PostsService } from './../services/posts.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Post } from 'src/common/databases/posts.entity';
import { PostRegisterModel } from '../models/post.register.model';
import { PostUpdateModel } from '../models/post.update.model';
import { PostDeleteModel } from '../models/post.delete.model';

@Resolver('post')
export class PostResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [Post])
  @UseGuards(GqlAuthGuard)
  async getPostsByUserId(
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Post[] | Error> {
    return await this.postsService.getPostsByUserId(parseInt(id));
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
}
