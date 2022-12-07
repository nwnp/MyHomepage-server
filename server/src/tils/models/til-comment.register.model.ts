import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TilCommentRegisterModel {
  @Field(() => Int)
  TilId: number;

  @Field(() => Int)
  UserId: number;

  @Field(() => Int)
  til_comment: string;
}
