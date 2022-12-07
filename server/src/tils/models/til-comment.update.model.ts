import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TilCommentUpdateModel {
  @Field(() => Int)
  id: number; // Til-Comment id

  @Field(() => Int)
  CommentedUserId: number;

  @Field(() => Int)
  til_comment: string;
}
