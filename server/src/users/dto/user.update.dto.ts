import { IsOptional, IsString, Length, IsNotEmpty } from 'class-validator';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserUpdateDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  @Length(8)
  password: string;

  @IsString()
  @Length(3, 20)
  @IsOptional()
  nickname: string;

  @IsString()
  @IsOptional()
  githubUrl: string;

  @IsString()
  @IsOptional()
  blogUrl: string;
}
