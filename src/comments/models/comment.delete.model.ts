import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentDeleteModel {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  commentedUserId: number;
}
