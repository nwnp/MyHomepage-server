import { ERROR } from 'src/common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Calendar } from 'src/common/databases/calendars.entity';
import { CalRegisterModel } from '../models/calendar.register.model';

@Injectable()
export class CalendarsDao {
  private readonly logger = new Logger('CALENDAR-DB');
  constructor(private readonly dataSource: DataSource) {}

  //   new Date().toISOString().
  //   replace(/T/, ' ').      // replace T with a space
  //   replace(/\..+/, '')     // delete the dot and everything after
  // > '2012-11-04 14:55:45'

  async checkPostInCal(info: CalRegisterModel): Promise<Calendar> {
    try {
      const isExistCal = await this.dataSource
        .getRepository(Calendar)
        .createQueryBuilder('cal')
        .where('cal.UserId = :UserId', { UserId: info.UserId })
        .andWhere('cal.PostId = :PostId', { PostId: info.PostId })
        .execute();
      return isExistCal;
    } catch (error) {
      console.error(error);
      this.logger.error('GET CALENDAR API ERROR');
      throw new GraphQLError(
        'SERVER ERROR',
        ERROR.CALENDAR('GET_CALENDAR_API_ERROR'),
      );
    }
  }

  async registerPostInCal(info: CalRegisterModel): Promise<boolean | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to register calendar');
      const cal = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Calendar)
        .values({
          PostId: info.PostId,
          UserId: info.UserId,
        })
        .execute();
      this.logger.verbose('Success to register calendar');
      return cal.generatedMaps[0] ? true : false;
    } catch (error) {
      this.logger.error('TRANSACTION ERROR');
      console.error(error);
      return new GraphQLError(
        'SERVER ERROR',
        ERROR.CALENDAR('REGISTER_CALENDAR_ERROR'),
      );
    } finally {
      await queryRunner.release();
      this.logger.verbose('Release transaction to register calendar');
    }
  }
}
