import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostDeleteModel {
  @Field(() => Int)
  UserId: number;

  @Field(() => Int)
  postId: number;
}
