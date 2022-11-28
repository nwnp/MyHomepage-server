import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostCommentDeleteModel {
  @Field(() => Int)
  PostId: number;

  @Field(() => Int)
  commentId: number;
}
