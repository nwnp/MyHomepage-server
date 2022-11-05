import { ERROR } from '../../common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/databases/users.entity';
import { Repository, DataSource } from 'typeorm';
import { UserSignupModel } from '../models/user.signup.model';
import { UserUpdateModel } from '../models/user.update.model';

@Injectable()
export class UsersDao {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async getUserById(id: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      return user;
    } catch (error) {
      throw new GraphQLError('Server Error', ERROR.INVALID_USER);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new GraphQLError('Server Error', ERROR.INVALID_USER);
    }
  }

  async getUserByNickname(nickname: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { nickname } });
      return user;
    } catch (error) {
      throw new GraphQLError('Server Error', ERROR.INVALID_USER);
    }
  }

  async getUserByBlogUrl(blogUrl: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { blogUrl } });
      return user;
    } catch (error) {
      throw new GraphQLError('Server Error', ERROR.INVALID_USER);
    }
  }

  async getUserByGithubUrl(githubUrl: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { githubUrl } });
      return user;
    } catch (error) {
      throw new GraphQLError('Server Error', ERROR.INVALID_USER);
    }
  }

  async signup(userInfo: UserSignupModel) {
    const logger = new Logger('DB');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      logger.verbose('Start Transaction for signup');
      const newUser = await this.usersRepository.save(userInfo);
      return newUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Transaction ERROR', error);
      throw new GraphQLError('Server Error', ERROR.SIGNUP_ERROR);
    } finally {
      logger.verbose('Released Transaction for signup');
      await queryRunner.release();
    }
  }

  async allUser() {
    const users = await this.usersRepository.find();
    return users;
  }

  async update(user: UserUpdateModel) {
    const logger = new Logger('DB');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      logger.verbose('Start Transaction for update user');
      const updatedUser = await this.dataSource
        .createQueryBuilder()
        .update(User)
        .set({
          nickname: user.nickname,
          password: user.password,
          githubUrl: user.githubUrl,
          blogUrl: user.blogUrl,
        })
        .where('id = :id', { id: parseInt(user.id) })
        .execute();

      logger.verbose('Success transaction');
      return updatedUser;
    } catch (error) {
      logger.error('Transaction ERROR', error);
      throw new GraphQLError('Server Error', ERROR.UPDATE_ERROR);
    } finally {
      await queryRunner.release();
      logger.verbose('Released Transaction for update user');
    }
  }

  async registerRefreshToken(id: number, refreshToken: string) {
    const logger = new Logger('DB');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updatedUser = await this.dataSource
        .createQueryBuilder()
        .update(User)
        .set({ refreshToken })
        .where('id = :id', { id })
        .execute();
      return updatedUser;
    } catch (error) {
      logger.error('Transaction ERROR');
      console.log(error);
      throw new GraphQLError('Server Error', ERROR.UPDATE_ERROR);
    } finally {
      await queryRunner.release();
      logger.verbose('Released Transaction for update login');
    }
  }
}
