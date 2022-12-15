import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostRegisterModel {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => Int)
  UserId: number;
}
