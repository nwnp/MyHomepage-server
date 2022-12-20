import { GqlAuthGuard } from './../../auth/guard/gql.auth.guard';
import { FeedbacksService } from './../services/feedbacks.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FeedbackRegisterModel } from '../models/feedback.register.model';

@Resolver()
export class FeedbacksResolver {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async registerFeedback(
    @Args('feedback') feedback: FeedbackRegisterModel,
  ): Promise<boolean> {
    return await this.feedbacksService.registerFeedback(feedback);
  }
}
