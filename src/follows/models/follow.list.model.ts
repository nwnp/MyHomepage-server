import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FollowListType } from 'src/common/types';

@ObjectType()
export class FollowListModel {
  @Field(() => Int)
  userId: number;

  @Field(() => String)
  type: FollowListType;
}
