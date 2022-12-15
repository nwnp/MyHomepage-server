import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FollowingRegister {
  @Field(() => Int)
  FollowingId: number; // Header token

  @Field(() => Int)
  FollowerId: number; // body로 받기
}
