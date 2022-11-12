import { CommentDeleteModel } from './../models/comment.delete.model';
import { GqlAuthGuard } from './../../auth/guard/gql.auth.guard';
import { CommentsService } from './../services/comments.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommentRegisterModel } from '../models/comment.register.model';
import { Comment } from 'src/common/databases/comment.entity';
import { CommentUpdateModel } from '../models/comment.update.model';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async registerComment(
    @Args('commentInfo') commentInfo: CommentRegisterModel,
  ) {
    return await this.commentsService.registerComment(commentInfo);
  }

  @Query(() => [Comment])
  @UseGuards(GqlAuthGuard)
  async getComments(@Args('id') id: number): Promise<Comment[] | Error> {
    return await this.commentsService.getComments(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateComment(
    @Args('commentInfo') commentInfo: CommentUpdateModel,
  ): Promise<boolean | Error> {
    return await this.commentsService.updateComment(commentInfo);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteComment(
    @Args('commentInfo') commentInfo: CommentDeleteModel,
  ): Promise<boolean | Error> {
    return await this.commentsService.deleteComment(commentInfo);
  }
}
