import { IsOptional, IsString, Length } from 'class-validator';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserUpdateModel {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Length(8)
  password: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @Length(3, 20)
  @IsOptional()
  nickname: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  githubUrl: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  blogUrl: string;
}
