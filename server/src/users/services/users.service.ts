import { UserSignupModel } from './../models/user.signup.model';
import { ERROR } from './../../common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';
import { UsersDao } from '../dao/users.dao';
import { User } from 'src/common/databases/users.entity';
import { UserLoginInput } from '../models/user.login.model';
import * as bcrypt from 'bcrypt';
import { UserCheckModel } from '../models/user.check.model';
import { UserUpdateModel } from '../models/user.update.model';

@Injectable()
export class UsersService {
  constructor(private readonly usersDao: UsersDao) {}

  async me(id: number): Promise<User> {
    const isExistUser = await this.usersDao.getUserById(id);
    if (!isExistUser)
      throw new GraphQLError('존재하지 않는 회원', ERROR.INVALID_USER);
    return isExistUser;
  }

  async allUser(): Promise<User[]> {
    return await this.usersDao.allUser();
  }

  async searchUser(nickname: string): Promise<User> {
    const searchedUser = await this.usersDao.getUserByNickname(nickname);
    if (!searchedUser)
      throw new GraphQLError('존재하지 않는 회원', ERROR.INVALID_USER);

    return searchedUser;
  }

  async userCheck(userInfo: UserCheckModel): Promise<boolean> {
    const user = await this.usersDao.getUserByEmail(userInfo.email);

    if (!user) throw new GraphQLError('존재하지 않는 회원', ERROR.INVALID_USER);

    if (userInfo.password !== userInfo.passwordCheck)
      throw new GraphQLError('비밀번호를 틀렸습니다.', ERROR.INVALID_PASSWORD);

    const compared = await bcrypt.compare(userInfo.password, user.password);
    if (!compared)
      throw new GraphQLError('비밀번호를 틀렸습니다.', ERROR.INVALID_PASSWORD);

    return true;
  }

  async signup(user: UserSignupModel): Promise<User> {
    const { email, password, nickname, blogUrl, githubUrl, job, gender } = user;
    const isExistEmail = await this.usersDao.getUserByEmail(email);
    const isExistNickname = await this.usersDao.getUserByNickname(nickname);
    const isExistBlogUrl = blogUrl
      ? await this.usersDao.getUserByBlogUrl(blogUrl)
      : null;
    const isExistGithubUrl = githubUrl
      ? await this.usersDao.getUserByGithubUrl(githubUrl)
      : null;
    const SALT = parseInt(process.env.PASSWORD_SALT);
    const userJob = job ? job : 'jobless';
    const userGender = gender ? gender : 'male';

    if (isExistEmail)
      throw new GraphQLError('이미 존재하는 이메일', ERROR.EXIST_EMAIL);

    if (isExistNickname)
      throw new GraphQLError('이미 존재하는 이메일', ERROR.EXIST_NICKNAME);

    if (isExistBlogUrl)
      throw new GraphQLError('이미 존재하는 블로그 URL', ERROR.EXIST_BLOG_URL);

    if (isExistGithubUrl)
      throw new GraphQLError(
        '이미 존재하는 깃허브 URL',
        ERROR.EXIST_GITHUB_URL,
      );

    const hashedPassword = await bcrypt.hash(password, SALT);
    const newUser = {
      ...user,
      password: hashedPassword,
      job: userJob,
      gender: userGender,
    };

    return await this.usersDao.signup(newUser);
  }

  // TODO: error 고치기
  async updateUser(user: UserUpdateModel): Promise<any> {
    const userInfo = { ...user };
    const updatedUser = await this.usersDao.update(userInfo);
    console.log(updatedUser);

    return updatedUser;
  }
}
