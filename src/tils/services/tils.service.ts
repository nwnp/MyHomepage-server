import { UsersDao } from './../../users/dao/users.dao';
import { ERROR } from 'src/common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { TilsDao } from './../dao/tils.dao';
import { Injectable } from '@nestjs/common';
import { TilRegisterModel } from '../models/til.register.model';
import { Til } from 'src/common/databases/tils.entity';
import { TilUpdateModel } from '../models/til.update.model';
import { TilDeleteModel } from '../models/til.delete.model';
import { TilLimitedModel } from '../models/til.limited.model';
import { returnDate } from 'src/common/functions/functions';
import { TilCommentRegisterModel } from '../models/til-comment.register.model';
import { TilComment } from 'src/common/databases/til-comments.entity';
import { TilCommentUpdateModel } from '../models/til-comment.update.model';
import { TilCommentDeleteModel } from '../models/til-comment.delete.model';

@Injectable()
export class TilsService {
  constructor(
    private readonly tilsDao: TilsDao,
    private readonly usersDao: UsersDao,
  ) {}

  // TIL Read ➡️ all
  async getTilsByUserId(UserId: number, headerUserId: number): Promise<Til[]> {
    const tils = await this.tilsDao.getTilsByUserId(UserId);
    return await returnDate(tils);
  }

  // TIL Read ➡️ 최신 TIL 3개만 가져오기
  async getLimitedTils(til: TilLimitedModel): Promise<Til[]> {
    const tils = await this.tilsDao.getLimitedTils(til);
    const parsingData: Til[] = await returnDate(tils);
    return parsingData;
  }

  // TIL Create
  async registerTil(
    til: TilRegisterModel,
    headerUserId: number,
  ): Promise<boolean> {
    if (headerUserId !== til.UserId)
      throw new GraphQLError('유효하지 않은 회원', ERROR.USER('INVALID_USER'));
    return await this.tilsDao.registerTil(til);
  }

  // TIL Update
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

  // TIL Delete
  async deleteTil(til: TilDeleteModel, headerUserId: number): Promise<boolean> {
    const isExistTil = await this.tilsDao.getTilById(til.tilId);
    if (!isExistTil)
      throw new GraphQLError('유효하지 않은 TIL', ERROR.TIL('INVALID_TIL'));

    if (headerUserId !== til.UserId)
      throw new GraphQLError('유효하지 않은 회원', ERROR.USER('INVALID_USER'));

    return await this.tilsDao.deleteTil(til);
  }

  // TIL-Comment Create
  async registerTilComment(
    til: TilCommentRegisterModel,
    headerUserId: number,
  ): Promise<boolean> {
    const { UserId: userId, TilId: tilId, til_comment: tilComment } = til;
    if (userId !== headerUserId)
      throw new GraphQLError('유효하지 않은 회원', ERROR.USER('INVALID_USER'));

    const isExistUser = await this.usersDao.getUserById(userId);
    if (!isExistUser)
      throw new GraphQLError('유효하지 않은 회원', ERROR.USER('INVALID_USER'));

    const isExistTil = await this.tilsDao.getTilById(tilId);
    if (!isExistTil) {
      throw new GraphQLError(
        '유효하지 않은 TIL 정보',
        ERROR.TIL('INVALID_TIL_ID'),
      );
    }

    const handlingTilComment = tilComment.trim();
    if (handlingTilComment === '' || handlingTilComment.length < 2)
      throw new GraphQLError('잘못된 요청', ERROR.TIL('BAD_REQUEST'));

    return await this.tilsDao.registerTilComment(til);
  }

  // TIL-Comment Read
  async getTilWithComment(tilId: number): Promise<TilComment[]> {
    const isExistTil = await this.tilsDao.getTilById(tilId);
    if (!isExistTil) {
      throw new GraphQLError(
        '유효하지 않은 TIL 정보',
        ERROR.TIL('INVALID_TIL_ID'),
      );
    }
    return await this.tilsDao.getTilWithComment(tilId);
  }

  // TIL-Comment Update
  async updateTilComment(
    til: TilCommentUpdateModel,
    headerUserId: number,
  ): Promise<boolean> {
    if (headerUserId !== til.CommentedUserId)
      throw new GraphQLError('BAD REQUEST', ERROR.TIL('INVALID_USER_ID'));

    const { til_comment } = til;
    if (til_comment.trim() === '' && til_comment.trim().length === 1)
      throw new GraphQLError('BAD REQUEST', ERROR.TIL('BAD_BODY_DATA'));

    return await this.tilsDao.updateTilComment(til);
  }

  // TIL-Comment Delete
  async deleteTilComment(
    til: TilCommentDeleteModel,
    headerUserId: number,
  ): Promise<boolean> {
    if (headerUserId !== til.CommentedUserId)
      throw new GraphQLError('BAD REQUEST', ERROR.TIL('INVALID_USER_ID'));

    const isExistTilComment = await this.tilsDao.getTilCommentById(til.id);
    if (!isExistTilComment) {
      throw new GraphQLError(
        'BAD REQUEST',
        ERROR.TIL('INVALID_TIL-COMMENT_ID'),
      );
    }
    if (isExistTilComment.CommentedUserId !== til.CommentedUserId) {
      throw new GraphQLError('BAD REQUEST', ERROR.USER('INVALID_USER'));
    }
    return await this.tilsDao.deleteTilComment(til.id);
  }
}
