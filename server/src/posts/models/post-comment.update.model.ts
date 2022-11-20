import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PostCommentUpdateModel {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  UserId: number;

  @Field(() => Int)
  PostId: number;

  @Field(() => String)
  post_comment: string;
}
