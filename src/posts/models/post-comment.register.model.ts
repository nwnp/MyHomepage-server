import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostCommentRegisterModel {
  @Field(() => Int)
  PostId: number;

  @Field(() => String)
  comment: string;

  @Field(() => Int)
  UserId: number;
}
