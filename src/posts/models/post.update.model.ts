import { Field, ObjectType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class PostUpdateModel {
  @Field(() => String, { nullable: true })
  @IsOptional()
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  content: string;

  @Field(() => Int)
  PostId: number;

  @Field(() => Int)
  UserId: number;
}
