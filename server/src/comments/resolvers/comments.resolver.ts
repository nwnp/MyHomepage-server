import { GqlAuthGuard } from './../../auth/guard/gql.auth.guard';
import { CommentsService } from './../services/comments.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommentRegisterModel } from '../models/comment.register.model';
import { Comment } from 'src/common/databases/comment.entity';
import { CommentUpdateModel } from '../models/comment.update.model';
import { CurrentUser } from 'src/common/functions/current.user';
import { User } from 'src/common/databases/users.entity';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async registerComment(
    @Args('commentInfo') commentInfo: CommentRegisterModel,
    @CurrentUser() user: User,
  ) {
    return await this.commentsService.registerComment(commentInfo, user.id);
  }

  @Query(() => [Comment])
  @UseGuards(GqlAuthGuard)
  async getComments(@CurrentUser() user: User): Promise<Comment[] | Error> {
    return await this.commentsService.getComments(user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateComment(
    @Args('commentInfo') commentInfo: CommentUpdateModel,
    @CurrentUser() user: User,
  ): Promise<boolean | Error> {
    return await this.commentsService.updateComment(commentInfo, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteComment(
    @Args('commentId') commentId: number,
    @CurrentUser() user: User,
  ): Promise<boolean | Error> {
    return await this.commentsService.deleteComment(commentId, user.id);
  }
}
