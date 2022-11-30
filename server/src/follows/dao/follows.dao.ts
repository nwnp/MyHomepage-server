import { ERROR } from 'src/common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from 'src/common/databases/follows.entity';
import { Repository, DataSource } from 'typeorm';
import { FollowingRegister } from '../models/following.register.model';

@Injectable()
export class FollowsDao {
  private readonly logger = new Logger('FOLLOW-DB');
  constructor(
    @InjectRepository(Follow)
    private readonly followsRepository: Repository<Follow>,
    private readonly dataSource: DataSource,
  ) {}

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
