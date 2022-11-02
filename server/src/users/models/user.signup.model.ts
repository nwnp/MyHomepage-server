import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@ObjectType()
export class UserSignupDto {
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  nickname: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @Length(8)
  password: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  gender: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  job: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  githubUrl: string;

  @Field(() => String)
  @IsOptional()
  @IsString()
  blogUrl: string;
}
