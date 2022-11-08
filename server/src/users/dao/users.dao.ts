import { ERROR } from '../../common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/databases/users.entity';
import { Repository, DataSource, createQueryBuilder } from 'typeorm';
import { UserSignupModel } from '../models/user.signup.model';
import { UserUpdateModel } from '../models/user.update.model';
import { Token } from 'src/common/databases/token.entity';

@Injectable()
export class UsersDao {
  private readonly logger = new Logger('DB');
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start Transaction for signup');
      const newUser = await this.usersRepository.save(userInfo);
      return newUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Transaction ERROR', error);
      throw new GraphQLError('Server Error', ERROR.SIGNUP_ERROR);
    } finally {
      this.logger.verbose('Released Transaction for signup');
      await queryRunner.release();
    }
  }

  async allUser() {
    const users = await this.usersRepository.find();
    return users;
  }

  async update(user: UserUpdateModel) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start Transaction for update user');
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

      this.logger.verbose('Success transaction');
      return updatedUser;
    } catch (error) {
      this.logger.error('Transaction ERROR', error);
      throw new GraphQLError('Server Error', ERROR.UPDATE_ERROR);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released Transaction for update user');
    }
  }

  async registerRefreshToken(id: number, refreshToken: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('Start Transaction to update refresh token');
      const updatedToken = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Token)
        .values([{ refreshToken }])
        .execute();

      let updatedUser;
      if (updatedToken.raw.affectedRows) {
        updatedUser = await this.dataSource
          .createQueryBuilder()
          .update(User)
          .set({ TokenId: updatedToken.raw.insertId })
          .where('id = :id', { id })
          .execute();
      }
      this.logger.verbose('Success Transaction');
      return updatedUser;
    } catch (error) {
      this.logger.error('Transaction ERROR');
      console.log(error);
      throw new GraphQLError('Server Error', ERROR.UPDATE_ERROR);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released Transaction to update refresh token');
    }
  }

  async deleteRefreshToken(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const refreshToken = null;
      this.logger.verbose('Start Transaction to update refresh token');
      const updatedUser = await this.dataSource
        .createQueryBuilder()
        .update(User)
        .set({ refreshToken })
        .where('id = :id', { id })
        .execute();
      this.logger.verbose('Success Transaction');
      return updatedUser;
    } catch (error) {
      this.logger.error('Transaction ERROR');
      console.log(error);
      throw new GraphQLError('Server Error', ERROR.UPDATE_ERROR);
    } finally {
      await queryRunner.release();
      this.logger.verbose('Released Transaction to delete refresh token');
    }
  }

  async joinTokenById(TokenId: number) {
    const userAndToken = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.token', 'token')
      .where('user.TokenId = :TokenId', { TokenId })
      .getOne();
    return userAndToken;
  }
}
