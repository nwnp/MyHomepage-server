import { IsOptional, IsString, Length, IsNotEmpty } from 'class-validator';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserUpdateDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  id: string;

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
