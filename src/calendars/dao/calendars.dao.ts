import { CalendarsByDateModel } from './../models/calendars.list.model';
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

  async deleteByPostId(PostId: number) {
    try {
      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Calendar)
        .where('PostId = :PostId', { PostId })
        .execute();
    } catch (error) {
      console.log(error);
      throw new GraphQLError('DELETE BY POST_ID ERROR');
    }
  }

  async deleteByTilId(TilId: number) {
    try {
      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Calendar)
        .where('TilId = :TilId', { TilId })
        .execute();
    } catch (error) {
      console.log(error);
      throw new GraphQLError('DELETE BY TIL_ID ERROR');
    }
  }

  // Read Post - only one
  async checkPostInCal(info: CalRegisterModel): Promise<Calendar> {
    try {
      const isExistCal = await this.dataSource
        .getRepository(Calendar)
        .createQueryBuilder('cal')
        .where('cal.UserId = :UserId', { UserId: info.UserId })
        .andWhere('cal.PostId = :PostId', { PostId: info.PostId })
        .getOne();
      return isExistCal;
    } catch (error) {
      console.error(error);
      this.logger.error('GET_CALENDAR_API_ERROR');
      throw new GraphQLError(
        'SERVER ERROR',
        ERROR.CALENDAR('GET_CALENDAR_API_ERROR'),
      );
    }
  }

  // Read Post - all by createdAt
  async getCalendarsByDate(info: CalendarsByDateModel): Promise<Calendar[]> {
    try {
      const date = info.date.split('.')[0].split(' ')[0];
      const calendars = await this.dataSource
        .getRepository(Calendar)
        .createQueryBuilder('calendar')
        .innerJoinAndSelect('calendar.post', 'post')
        .where('calendar.UserId = :UserId', { UserId: info.UserId })
        .andWhere(`calendar.createdAt LIKE '%${date}%'`)
        .getMany();
      return calendars;
    } catch (error) {
      console.error(error);
      this.logger.error('GET_POSTS_IN_CALENDAR_API_ERROR');
      throw new GraphQLError(
        'SERVER ERROR',
        ERROR.CALENDAR('GET_POSTS_IN_CALENDAR_API_ERROR'),
      );
    }
  }

  // Read Post & TIL - all
  async getAllPostsTils(UserId: number): Promise<Calendar[]> {
    try {
      const tilsAndPosts = await this.dataSource
        .getRepository(Calendar)
        .createQueryBuilder('calendar')
        .leftJoinAndSelect('calendar.post', 'post')
        .leftJoinAndSelect('calendar.til', 'til')
        .where('calendar.UserId = :UserId', { UserId })
        .getMany();
      return tilsAndPosts;
    } catch (error) {
      this.logger.error('CALENDAR READ TIL-POSTS ERROR');
      console.error(error);
      throw new GraphQLError(
        'SERVER ERROR',
        ERROR.SERVER_ERROR('TIL, POST LIST ERROR'),
      );
    }
  }

  // all posts in Calendar
  async getAllPostsInCal(UserId: number): Promise<Calendar[]> {
    try {
      const calendars = await this.dataSource
        .getRepository(Calendar)
        .createQueryBuilder('calendar')
        .innerJoinAndSelect('calendar.post', 'post')
        .where('calendar.UserId = :UserId', { UserId })
        .getMany();
      return calendars;
    } catch (error) {
      this.logger.error('GET_ALL_POSTS_IN_CAL_ERROR');
      console.error(error);
      throw new GraphQLError(
        'SERVER ERROR',
        ERROR.CALENDAR('GET_ALL_POSTS_IN_CAL_ERROR'),
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
