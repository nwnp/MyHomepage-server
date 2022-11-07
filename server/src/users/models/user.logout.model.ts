import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserLogoutModel {
  @Field(() => Boolean)
  id: number;
}
