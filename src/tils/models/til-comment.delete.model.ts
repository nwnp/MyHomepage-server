import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TilCommentDeleteModel {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  CommentedUserId: number;
}
