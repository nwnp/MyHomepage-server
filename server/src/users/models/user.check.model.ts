import { ObjectType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@ObjectType()
export class UserCheckDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Length(8)
  passwordCheck: string;
}
