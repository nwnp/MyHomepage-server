import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentUpdateModel {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  comment: string;
}
