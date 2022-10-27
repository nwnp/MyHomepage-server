import { ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@ObjectType()
export class UserCheckDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  passwordCheck: string;
}
