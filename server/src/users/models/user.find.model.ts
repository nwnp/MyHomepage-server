import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserFindModel {
  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  nickname: string;
}
