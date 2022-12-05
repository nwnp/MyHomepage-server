import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class TilRegisterModel {
  @Field(() => String)
  @IsOptional()
  title: string;

  @Field(() => String)
  til_content: string;

  @Field(() => Int)
  UserId: number;
}
