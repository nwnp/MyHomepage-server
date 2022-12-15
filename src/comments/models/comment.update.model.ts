import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentUpdateModel {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  comment: string;

  @Field(() => Int)
  UserId: number;

  @Field(() => Int)
  CommentedUserId: number;
}
