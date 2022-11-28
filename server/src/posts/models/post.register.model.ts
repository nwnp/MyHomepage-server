import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostRegisterModel {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;
}
