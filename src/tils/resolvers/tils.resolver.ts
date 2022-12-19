import { TilCommentRegisterModel } from '../models/til-comment.register.model';
import { User } from 'src/common/databases/users.entity';
import { GqlAuthGuard } from '../../auth/guard/gql.auth.guard';
import { UseGuards } from '@nestjs/common';
import { TilsService } from '../services/tils.service';
import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { TilRegisterModel } from '../models/til.register.model';
import { CurrentUser } from 'src/common/functions/current.user';
import { Til } from 'src/common/databases/tils.entity';
import { TilUpdateModel } from '../models/til.update.model';
import { TilDeleteModel } from '../models/til.delete.model';
import { TilLimitedModel } from '../models/til.limited.model';
import { TilComment } from 'src/common/databases/til-comments.entity';
import { TilCommentUpdateModel } from '../models/til-comment.update.model';
import { TilCommentDeleteModel } from '../models/til-comment.delete.model';

@Resolver()
export class TilsResolver {
  constructor(private readonly tilsService: TilsService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async getTilsByUserId(
    @Args('UserId') UserId: number,
    @CurrentUser() user: User,
  ): Promise<Til[]> {
    return this.tilsService.getTilsByUserId(UserId, user.id);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async getLimitedTils(@Args('til') til: TilLimitedModel): Promise<Til[]> {
    return await this.tilsService.getLimitedTils(til);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async getTilWithComment(@Args('tilId') tilId: number): Promise<TilComment[]> {
    return await this.tilsService.getTilWithComment(tilId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async registerTil(
    @Args('til') til: TilRegisterModel,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.tilsService.registerTil(til, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateTil(
    @Args('til') til: TilUpdateModel,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.tilsService.updateTil(til, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteTil(
    @Args('til') til: TilDeleteModel,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.tilsService.deleteTil(til, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async registerTilComment(
    @Args('til') til: TilCommentRegisterModel,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.tilsService.registerTilComment(til, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateTilComment(
    @Args('til') til: TilCommentUpdateModel,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.tilsService.updateTilComment(til, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteTilComment(
    @Args('til') til: TilCommentDeleteModel,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.tilsService.deleteTilComment(til, user.id);
  }
}
