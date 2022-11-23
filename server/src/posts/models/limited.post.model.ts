import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LimitedPostsModel {
  @Field(() => ID)
  UserId: number;

  @Field(() => Int)
  count: number;
}
