import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PostCommentUpdateModel {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  PostId: number;

  @Field(() => Int)
  UserId: number;

  @Field(() => String)
  comment: string;
}
