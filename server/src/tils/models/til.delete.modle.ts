import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TilDeleteModel {
  @Field(() => Int)
  tilId: number;

  @Field(() => Int)
  UserId: number;
}
