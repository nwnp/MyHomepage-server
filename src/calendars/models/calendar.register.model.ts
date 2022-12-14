import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CalRegisterModel {
  @Field(() => Int)
  UserId: number;

  @Field(() => Int)
  PostId: number;
}
