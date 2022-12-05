import { ERROR } from 'src/common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { TilsDao } from './../dao/tils.dao';
import { Injectable } from '@nestjs/common';
import { TilRegisterModel } from '../models/til.register.model';
import { Til } from 'src/common/databases/tils.entity';
import { TilUpdateModel } from '../models/til.update.model';
import { TilDeleteModel } from '../models/til.delete.modle';

@Injectable()
export class TilsService {
  constructor(private readonly tilsDao: TilsDao) {}

  async getTilsByUserId(UserId: number, headerUserId: number): Promise<Til[]> {
    if (UserId !== headerUserId)
      throw new GraphQLError('유효하지 않은 회원', ERROR.USER('INVALID_USER'));
    return await this.tilsDao.getTilsByUserId(UserId);
  }

  async registerTil(
    til: TilRegisterModel,
    headerUserId: number,
  ): Promise<boolean> {
    if (headerUserId !== til.UserId)
      throw new GraphQLError('유효하지 않은 회원', ERROR.USER('INVALID_USER'));
    return await this.tilsDao.registerTil(til);
  }

  async updateTil(til: TilUpdateModel, headerUserId: number): Promise<boolean> {
    const til_content = til.til_content ? til.til_content : null;
    const title = til.title ? til.title : null;
    if (til_content === null && title === null) {
      throw new GraphQLError(
        '유효하지 않은 입력값',
        ERROR.TIL('INVALID_INPUT_VALUE'),
      );
    }
    const isExistTil = await this.tilsDao.getTilById(til.tilId);
    if (!isExistTil)
      throw new GraphQLError('유효하지 않은 TIL', ERROR.TIL('INVALID_TIL'));

    if (headerUserId !== til.UserId)
      throw new GraphQLError('유효하지 않은 회원', ERROR.USER('INVALID_USER'));
    return await this.tilsDao.updateTil({
      ...til,
      title,
      til_content,
    });
  }

  async deleteTil(til: TilDeleteModel, headerUserId: number): Promise<boolean> {
    const isExistTil = await this.tilsDao.getTilById(til.tilId);
    if (!isExistTil)
      throw new GraphQLError('유효하지 않은 TIL', ERROR.TIL('INVALID_TIL'));

    if (headerUserId !== til.UserId)
      throw new GraphQLError('유효하지 않은 회원', ERROR.USER('INVALID_USER'));

    return await this.tilsDao.deleteTil(til);
  }
}
