import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentUpdateModel {
  @Field(() => String)
  comment: string;

  @Field(() => ID)
  id: number;

  @Field(() => ID)
  commentedUserId: number;
}
