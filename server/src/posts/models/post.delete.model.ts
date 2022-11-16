import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostDeleteModel {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  UserId: number;
}
