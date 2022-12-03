import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CalendarsByDateModel {
  @Field(() => Int)
  UserId: number;

  @Field(() => String)
  date: string;
}
