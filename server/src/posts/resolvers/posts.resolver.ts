import { GqlAuthGuard } from './../../auth/guard/gql.auth.guard';
import { PostsService } from './../services/posts.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Post } from 'src/common/databases/posts.entity';
import { PostRegisterModel } from '../models/post.register.model';

@Resolver('post')
export class PostResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [Post])
  @UseGuards(GqlAuthGuard)
  async getPostByUserId(
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Post[]> {
    return await this.postsService.getPostsByUserId(parseInt(id));
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async register(@Args('post') post: PostRegisterModel): Promise<any> {
    return await this.postsService.register(post);
  }
}
