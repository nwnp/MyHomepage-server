import { Injectable } from '@nestjs/common';
import { Field, Int } from '@nestjs/graphql';

@Injectable()
export class FeedbackRegisterModel {
  @Field(() => Int)
  UserId: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;
}
