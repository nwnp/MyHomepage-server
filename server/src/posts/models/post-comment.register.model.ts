import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostCommentRegisterModel {
  @Field(() => Int)
  UserId: number;

  @Field(() => Int)
  PostId: number;

  @Field(() => String)
  comment: string;
}
