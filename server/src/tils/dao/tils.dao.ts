import { CalendarsDao } from './../../calendars/dao/calendars.dao';
import { ERROR } from 'src/common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Til } from 'src/common/databases/tils.entity';
import { Repository, DataSource } from 'typeorm';
import { TilRegisterModel } from '../models/til.register.model';
import { TilUpdateModel } from '../models/til.update.model';
import { TilDeleteModel } from '../models/til.delete.model';
import { TilLimitedModel } from '../models/til.limited.model';
import { TilCommentRegisterModel } from '../models/til-comment.register.model';
import { TilComment } from 'src/common/databases/til-comments.entity';
import { TilCommentUpdateModel } from '../models/til-comment.update.model';

@Injectable()
export class TilsDao {
  private readonly logger = new Logger('TIL-DB');
  constructor(
    @InjectRepository(Til) private readonly tilsRepository: Repository<Til>,
    private readonly dataSource: DataSource,
    private readonly calendarsDao: CalendarsDao,
  ) {}

  async deleteAllTilCommentById(TilId: number): Promise<boolean> {
    try {
      const deleted = await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(TilComment)
        .where('TilId = :TilId', { TilId })
        .execute();
      return deleted.affected ? true : false;
    } catch (error) {
      throw new GraphQLError('ALL DELETE POST-COMMENT ERROR');
    }
  }

  // TIL Read ➡️ all
  async getTilsByUserId(UserId: number): Promise<Til[]> {
    try {
      const tils = await this.dataSource
        .getRepository(Til)
        .createQueryBuilder('til')
        .innerJoinAndSelect('til.user', 'user')
        .where('til.UserId = :UserId', { UserId })
        .orderBy('til.createdAt', 'DESC')
        .getMany();
      return tils;
    } catch (error) {
      this.logger.error(error);
      console.error(error);
      throw new GraphQLError('SERVER ERROR', ERROR.TIL('GET TIL LIST ERROR'));
    }
  }

  // TIL Read ➡️ only one
  async getTilById(tilId: number): Promise<Til> {
    try {
      const til = await this.dataSource
        .getRepository(Til)
        .createQueryBuilder('til')
        .where('til.id = :id', { id: tilId })
        .getOne();
      return til;
    } catch (error) {
      this.logger.error('TIL SELECT ERROR');
      console.error(error);
      throw new GraphQLError(
        'SERVER ERROR',
        ERROR.TIL('GET ONLY ONE TIL ERROR'),
      );
    }
  }

  // TIL Read ➡️ 최신 TIL 3개만 가져오기
  async getLimitedTils(til: TilLimitedModel): Promise<Til[]> {
    try {
      const tils = await this.dataSource
        .getRepository(Til)
        .createQueryBuilder('til')
        .leftJoinAndSelect('til.user', 'user')
        .where('til.UserId = :UserId', { UserId: til.UserId })
        .orderBy('til.id', 'DESC')
        .limit(til.count)
        .getMany();
      return tils;
    } catch (error) {
      this.logger.error('SERVER ERROR');
      console.error(error);
      throw new GraphQLError('SERVER ERROR', ERROR.TIL('LIMITED_TIL_ERROR'));
    }
  }

  // TIL Create
  async registerTil(til: TilRegisterModel): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to register til');
      const newTil = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Til)
        .values({
          til_content: til.til_content,
          title: til.title,
          UserId: til.UserId,
        })
        .execute();
      await queryRunner.commitTransaction();
      this.logger.verbose('Success to register til');
      return newTil.generatedMaps[0] ? true : false;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('TIL Register Transaction ERROR');
      console.error(error);
      throw new GraphQLError('SERVER ERROR', ERROR.TIL('TIL_REGISTER_ERROR'));
    } finally {
      await queryRunner.release();
      this.logger.verbose('Release Transaction to register til');
    }
  }

  // TIL Update
  async updateTil(til: TilUpdateModel): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to update til');
      const updatedTil = await this.dataSource
        .createQueryBuilder()
        .update(Til)
        .set({
          til_content: til.til_content,
          title: til.title,
        })
        .where('id = :id', { id: til.tilId })
        .execute();
      await queryRunner.commitTransaction();
      this.logger.verbose('Success to update til');
      return updatedTil.affected ? true : false;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('TIL Update Transaction ERROR');
      console.error(error);
      throw new GraphQLError('SERVER ERROR', ERROR.TIL('UPDATE TIL ERROR'));
    } finally {
      await queryRunner.release();
      this.logger.verbose('Release Transaction to update til');
    }
  }

  // TIL Delete
  async deleteTil(til: TilDeleteModel): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to delete til');
      await this.calendarsDao.deleteByTilId(til.tilId);
      await this.deleteAllTilCommentById(til.tilId);
      const deletedTil = await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Til)
        .where('id = :id', { id: til.tilId })
        .execute();
      this.logger.verbose('Success transaction to delete til');
      await queryRunner.commitTransaction();
      return deletedTil.affected ? true : false;
    } catch (error) {
      this.logger.error('Transaction ERROR');
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new GraphQLError('SERVER ERROR', ERROR.TIL('DELETE_TIL_ERROR'));
    } finally {
      await queryRunner.release();
      this.logger.verbose('Release Transaction to delete til');
    }
  }

  // TIL-Comment Read
  async getTilCommentById(commentId: number): Promise<TilComment> {
    try {
      const tilComment = await this.dataSource
        .getRepository(TilComment)
        .createQueryBuilder('tilComment')
        .where('tilComment.id = :id', { id: commentId })
        .getOne();
      return tilComment;
    } catch (error) {
      this.logger.error('GET TIL-COMMENT ERROR');
      console.error(error);
      throw new GraphQLError(
        'SERVER ERROR',
        ERROR.TIL('GET_TIL-COMMENT_ERROR'),
      );
    }
  }

  // TIL-Comment Create
  async registerTilComment(til: TilCommentRegisterModel): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to register til-comment');
      const newTil = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(TilComment)
        .values({
          CommentedUserId: til.UserId,
          TilId: til.TilId,
          til_comment: til.til_comment,
        })
        .execute();
      await queryRunner.commitTransaction();
      this.logger.verbose('Success to register til-comment');
      return newTil.generatedMaps.length ? true : false;
    } catch (error) {
      this.logger.error('Transaction ERROR');
      console.error(error);
      await queryRunner.rollbackTransaction();
      this.logger.verbose('Rollback Transaction');
      throw new GraphQLError(
        'SERVER ERROR',
        ERROR.TIL('TIL-COMMENT_REGISTER_ERROR'),
      );
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released transaction to register til-comment');
    }
  }

  // TIL-Comment Read
  async getTilWithComment(tilId: number): Promise<TilComment[]> {
    try {
      const tils = await this.dataSource
        .getRepository(TilComment)
        .createQueryBuilder('tilComment')
        .innerJoinAndSelect('tilComment.user', 'user')
        .innerJoinAndSelect('tilComment.til', 'til')
        .where('tilComment.TilId = :id', { id: tilId })
        .getMany();
      return tils;
    } catch (error) {
      this.logger.error('GetTilWithComment ERROR');
      console.error(error);
      new GraphQLError('TIL 리스트 에러', ERROR.TIL('GET_TILS_ERROR'));
    }
  }

  // TIL-Comment Update
  async updateTilComment(til: TilCommentUpdateModel): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to update til-comment');
      const updatedTilComment = await this.dataSource
        .createQueryBuilder()
        .update(TilComment)
        .set({
          til_comment: til.til_comment,
        })
        .where('id = :id', { id: til.id })
        .execute();
      this.logger.verbose('Success to update til-comment');
      return updatedTilComment.affected ? true : false;
    } catch (error) {
      this.logger.error('Transaction ERROR');
      console.error(error);
      await queryRunner.rollbackTransaction();
      this.logger.verbose('Rollback transaction');
      throw new GraphQLError(
        'SERVER ERROR',
        ERROR.TIL('UPDATE TIL-COMMENT ERROR'),
      );
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released transaction to update til-comment');
    }
  }
  // TIL-Comment Delete
  async deleteTilComment(commentId: number): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transactio to delete til-comment');
      const deletedTilComment = await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(TilComment)
        .where('id = :id', { id: commentId })
        .execute();
      this.logger.verbose('Success transaction to delete til-comment');
      await queryRunner.commitTransaction();
      return deletedTilComment.affected ? true : false;
    } catch (error) {
      this.logger.error('Transaction ERROR');
      console.error(error);
      await queryRunner.rollbackTransaction();
      this.logger.verbose('Rollback Transaction');
      throw new GraphQLError(
        'SERVER ERROR',
        ERROR.TIL('DELETE_TIL_COMMENT ERROR'),
      );
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released transaction to delete til-comment');
    }
  }
}
