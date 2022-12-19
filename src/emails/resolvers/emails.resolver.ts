import { MailerModel } from '../models/mailer.model';
import { GqlAuthGuard } from '../../auth/guard/gql.auth.guard';
import { UseGuards } from '@nestjs/common';
import { EmailsService } from '../services/emails.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class EmailsResolver {
  constructor(private readonly emailsService: EmailsService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async sendMail(@Args('mail') mail: MailerModel): Promise<boolean> {
    return await this.emailsService.mailer(mail);
  }
}
