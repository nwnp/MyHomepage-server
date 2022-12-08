import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class CommentRegisterModel {
  @Field(() => String)
  comment: string;

  @Field(() => ID)
  UserId: number;

  @Field(() => Int)
  @IsOptional()
  secret: number;
}
