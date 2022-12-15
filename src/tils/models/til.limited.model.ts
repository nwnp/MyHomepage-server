import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TilLimitedModel {
  @Field(() => Int)
  UserId: number;

  @Field(() => Int)
  count: number;
}
