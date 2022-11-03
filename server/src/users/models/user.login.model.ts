import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class UserLoginInput {
  @Field(() => String)
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @Length(8)
  password: string;
}
