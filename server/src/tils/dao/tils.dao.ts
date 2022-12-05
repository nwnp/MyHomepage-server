import { ERROR } from 'src/common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Til } from 'src/common/databases/tils.entity';
import { Repository, DataSource } from 'typeorm';
import { TilRegisterModel } from '../models/til.register.model';
import { TilUpdateModel } from '../models/til.update.model';
import { TilDeleteModel } from '../models/til.delete.modle';
import { TilLimitedModel } from '../models/til.limited.model';

@Injectable()
export class TilsDao {
  private readonly logger = new Logger('TIL-DB');
  constructor(
    @InjectRepository(Til) private readonly tilsRepository: Repository<Til>,
    private readonly dataSource: DataSource,
  ) {}

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
}
