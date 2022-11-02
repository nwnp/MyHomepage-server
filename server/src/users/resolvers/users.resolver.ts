import { UsersDao } from './../dao/users.dao';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ERROR } from '../../common/constant/error-handling';
import { UserSignupDto } from '../models/user.signup.model';
import { User } from 'src/common/databases/users.entity';
import * as bcrypt from 'bcrypt';
import { UserUpdateDto } from '../models/user.update.model';
import { UserCheckDto } from '../models/user.check.model';
import { UserLoginDto } from '../models/user.login.model';

@Resolver('user')
export class UserResolver {
  constructor(private readonly usersDao: UsersDao) {}

  @Query()
  async me(@Args({ name: 'id', type: () => Int }) id: number) {
    const isExistUser = await this.usersDao.getUserById(id);
    if (!isExistUser)
      throw new GraphQLError('존재하지 않는 회원', ERROR.INVALID_USER);
    return isExistUser;
  }

  @Query()
  async allUser() {
    return this.usersDao.allUser();
  }

  @Query()
  async searchUser(@Args('nickname') nickname: string) {
    const searchedUser = await this.usersDao.getUserByNickname(nickname);
    if (!searchedUser)
      throw new GraphQLError('존재하지 않는 회원', ERROR.INVALID_USER);

    return searchedUser;
  }

  @Query()
  async login(@Args('userInfo') userInfo: UserLoginDto) {
    const isExistUser = await this.usersDao.getUserByEmail(userInfo.email);
    const compared = await bcrypt.compare(
      userInfo.password,
      isExistUser.password,
    );
    if (!isExistUser)
      throw new GraphQLError('존재하지 않는 회원입니다.', ERROR.INVALID_USER);
    if (!compared)
      throw new GraphQLError('비밀번호를 틀렸습니다.', ERROR.INVALID_PASSWORD);
  }

  @Query()
  async userCheck(@Args('userInfo') userInfo: UserCheckDto) {
    const user = await this.usersDao.getUserByEmail(userInfo.email);
    const compared = await bcrypt.compare(userInfo.password, user.password);

    if (!user) throw new GraphQLError('존재하지 않는 회원', ERROR.INVALID_USER);
    if (userInfo.password !== userInfo.passwordCheck)
      throw new GraphQLError('비밀번호를 틀렸습니다.', ERROR.INVALID_PASSWORD);
    if (!compared)
      throw new GraphQLError('비밀번호를 틀렸습니다.', ERROR.INVALID_PASSWORD);

    return true;
  }

  @Mutation(() => User)
  async signup(@Args('user') user: UserSignupDto) {
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
      email,
      password: hashedPassword,
      nickname,
      blogUrl,
      githubUrl,
      job: userJob,
      gender: userGender,
    };

    return await this.usersDao.signup(newUser);
  }

  @Mutation(() => User)
  async updateUser(@Args('user') user: UserUpdateDto) {
    const userInfo = {
      id: user.id,
      password: user.password,
      nickname: user.nickname,
      githubUrl: user.githubUrl,
      blogUrl: user.blogUrl,
    };

    const updatedUser = await this.usersDao.update(userInfo);
    console.log(updatedUser);

    return updatedUser;
  }
}
