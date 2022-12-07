import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TilCommentUpdateModel {
  @Field(() => Int)
  TilId: number;

  @Field(() => Int)
  CommentedUserId: number;

  @Field(() => Int)
  til_comment: string;
}
