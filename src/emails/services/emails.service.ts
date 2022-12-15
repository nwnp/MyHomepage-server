import { ERROR } from 'src/common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { MailerModel } from './../models/mailer.model';
import { EmailDao } from './../dao/email.dao';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailsService {
  constructor(
    private readonly emailDao: EmailDao,
    private readonly mailerService: MailerService,
  ) {}

  async mailer(mail: MailerModel): Promise<boolean> {
    const { to, from, text, subject } = mail;
    if (
      to.trim() == '' ||
      from.trim() == '' ||
      text.trim() == '' ||
      subject.trim() == ''
    ) {
      throw new GraphQLError(
        '유효하지 않은 메일 형식',
        ERROR.MAILER('INVALID_EMAIL'),
      );
    }
    try {
      const send = await this.mailerService.sendMail({
        to,
        from,
        subject,
        text,
        html: '<b>welcome</b>',
      });
      console.log(send);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
