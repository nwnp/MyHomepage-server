import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LimitedPostsModel {
  @Field(() => Int)
  count: number;

  @Field(() => Int)
  UserId: number;
}
