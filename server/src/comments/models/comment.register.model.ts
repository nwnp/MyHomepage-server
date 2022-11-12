import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentRegisterModel {
  @Field(() => String)
  comment: string;

  @Field(() => ID)
  UserId: number;

  @Field(() => ID)
  commentedUserId: number;
}
