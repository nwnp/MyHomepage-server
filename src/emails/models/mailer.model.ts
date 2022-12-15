import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MailerModel {
  @Field(() => String)
  to: string;

  @Field(() => String)
  from: string;

  @Field(() => String)
  subject: string;

  @Field(() => String)
  text: string;
}
