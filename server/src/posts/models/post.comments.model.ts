import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostCommentsModel {
  @Field(() => Int)
  UserId: number;

  @Field(() => Int)
  PostId: number;
}
