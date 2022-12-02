import { GqlAuthGuard } from './../../auth/guard/gql.auth.guard';
import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CalendarsService } from '../services/calendars.service';
import { CurrentUser } from 'src/common/functions/current.user';
import { User } from 'src/common/databases/users.entity';
import { CalRegisterModel } from '../models/calendar.register.model';

@Resolver()
export class CalendarsResolver {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async registerPostInCal(
    @CurrentUser() user: User,
    @Args('info') info: CalRegisterModel,
  ): Promise<boolean | Error> {
    return await this.calendarsService.registerPostInCal(info);
  }
}
