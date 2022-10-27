import { ERROR } from '../../common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/databases/users.entity';
import { Repository, DataSource } from 'typeorm';
import { UserSignupDto } from '../dto/signup.dto';

@Injectable()
export class UsersDao {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async getUserByNickname(nickname: string) {
    const user = await this.usersRepository.findOne({ where: { nickname } });
    return user;
  }

  async getUserByBlogUrl(blogUrl: string) {
    const user = await this.usersRepository.findOne({ where: { blogUrl } });
    return user;
  }

  async getUserByGithubUrl(githubUrl: string) {
    const user = await this.usersRepository.findOne({ where: { githubUrl } });
    return user;
  }

  async signup(userInfo: UserSignupDto) {
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
}
