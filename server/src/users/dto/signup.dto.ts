import { ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@ObjectType()
export class UserSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  password: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  job: string;

  @IsString()
  @IsOptional()
  githubUrl: string;

  @IsOptional()
  @IsString()
  blogUrl: string;
}
