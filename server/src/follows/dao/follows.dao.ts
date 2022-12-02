import { ERROR } from 'src/common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from 'src/common/databases/follows.entity';
import { Repository, DataSource } from 'typeorm';
import { FollowingRegister } from '../models/following.register.model';
import { FollowsForLogin } from 'src/common/types/follows';

@Injectable()
export class FollowsDao {
  private readonly logger = new Logger('FOLLOW-DB');
  constructor(
    @InjectRepository(Follow)
    private readonly followsRepository: Repository<Follow>,
    private readonly dataSource: DataSource,
  ) {}

  // 나를 팔로우하는 user API
  async followingMe(userId: number): Promise<Follow[]> {
    try {
      console.log('following me');
      const followerList = await this.dataSource
        .getRepository(Follow)
        .createQueryBuilder('follow')
        .innerJoinAndSelect('follow.followers', 'user')
        .where('follow.FollowingId = :FollowingId', { FollowingId: userId })
        .getMany();
      return followerList;
    } catch (error) {
      console.error(error);
      throw new GraphQLError(
        'SERVER ERROR',
        ERROR.FOLLOWING('FOLLOWING_ME_API_ERROR'),
      );
    }
  }

  // 내가 팔로우하고 있는 user API
  async imFollowing(userId: number): Promise<Follow[]> {
    try {
      console.log('im following');
      const followerList = await this.dataSource
        .getRepository(Follow)
        .createQueryBuilder('follow')
        .innerJoinAndSelect('follow.followings', 'user')
        .where('follow.FollowerId = :FollowerId', { FollowerId: userId })
        .getMany();
      return followerList;
    } catch (error) {
      console.error(error);
      throw new GraphQLError(
        'SERVER ERROR',
        ERROR.FOLLOWING('IM_FOLLOWING_API_ERROR'),
      );
    }
  }

  async followsForLogin(FollowingId: number): Promise<FollowsForLogin> {
    try {
      const isFollowings = await this.dataSource
        .getRepository(Follow)
        .createQueryBuilder('follow')
        .innerJoinAndSelect('follow.followings', 'user')
        .where('follow.FollowingId = :id', { id: FollowingId })
        .getMany();
      const isFollowers = await this.dataSource
        .getRepository(Follow)
        .createQueryBuilder('follow')
        .innerJoinAndSelect('follow.followers', 'user')
        .where('follow.FollowerId = :id', { id: FollowingId })
        .getMany();
      return {
        following_me: isFollowings.length,
        im_following: isFollowers.length,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async checkFollow(info: FollowingRegister): Promise<boolean> {
    try {
      const isFollowing = await this.dataSource
        .getRepository(Follow)
        .createQueryBuilder('follow')
        .where('follow.FollowerId = :FollowerId', {
          FollowerId: info.FollowerId,
        })
        .andWhere('follow.FollowingId = :FollowingId', {
          FollowingId: info.FollowingId,
        })
        .getOne();
      return isFollowing ? true : false;
    } catch (error) {
      this.logger.error('CHECK FOLLOW ERROR');
      console.log(error);
      throw new GraphQLError('SERVER ERROR');
    }
  }

  async registerUnfollowing(info: FollowingRegister): Promise<boolean | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to register Unfollowing');
      const unfollow = await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Follow)
        .where('FollowerId = :FollowerId', {
          FollowerId: info.FollowerId,
        })
        .execute();
      await queryRunner.commitTransaction();
      this.logger.verbose('Succes to register unfollowing');
      return unfollow.affected ? true : false;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Rollback transaction');
      console.log(error);
      return new GraphQLError('SERVER ERROR', ERROR.REGISTER_UNFOLLOWING);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released Transaction to register unfollowing');
    }
  }

  // Header token UserId가 다른 UserId를 following
  async registerFollowing(info: FollowingRegister): Promise<boolean | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start transaction to register Following');
      const follow = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Follow)
        .values({
          FollowingId: info.FollowingId,
          FollowerId: info.FollowerId,
        })
        .execute();
      await queryRunner.commitTransaction();
      this.logger.verbose('Success to register following');
      return follow ? true : false;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Rollback Transaction');
      console.log(error);
      return new GraphQLError('SERVER ERROR', ERROR.REGISTER_FOLLOWING);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released Transaction to register following');
    }
  }
}
