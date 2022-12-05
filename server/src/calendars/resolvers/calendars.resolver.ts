import { GqlAuthGuard } from './../../auth/guard/gql.auth.guard';
import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CalendarsService } from '../services/calendars.service';
import { CurrentUser } from 'src/common/functions/current.user';
import { User } from 'src/common/databases/users.entity';
import { CalRegisterModel } from '../models/calendar.register.model';
import { Calendar } from 'src/common/databases/calendars.entity';
import { CalendarsByDateModel } from '../models/calendars.list.model';

@Resolver()
export class CalendarsResolver {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async getAllPostsInCal(
    // @CurrentUser() user: User,
    @Args('UserId') UserId: number,
  ): Promise<Calendar[] | Error> {
    return await this.calendarsService.getAllPostsInCal(UserId);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async getCalendarsByDate(
    @Args('info') info: CalendarsByDateModel,
  ): Promise<Calendar[]> {
    return await this.calendarsService.getCalendarsByDate(info);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async registerPostInCal(
    @CurrentUser() user: User,
    @Args('info') info: CalRegisterModel,
  ): Promise<boolean | Error> {
    return await this.calendarsService.registerPostInCal(info);
  }
}
