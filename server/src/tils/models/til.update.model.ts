import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class TilUpdateModel {
  @Field(() => Int)
  UserId: number;

  @Field(() => Int)
  tilId: number;

  @Field(() => String)
  @IsOptional()
  til_content: string;

  @Field(() => String)
  @IsOptional()
  title: string;
}
