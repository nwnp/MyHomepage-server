import { IUserToken } from './../../common/interfaces/user.interface';
import { ERROR } from './../../common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { UsersDao } from './../../users/dao/users.dao';
import { Injectable, Logger } from '@nestjs/common';
import { UserLoginInput } from 'src/users/models/user.login.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersDao: UsersDao,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userInfo: UserLoginInput): Promise<string> {
    const user = await this.usersDao.getUserByEmail(userInfo.email);
    const date = new Date();
    if (!user) throw new GraphQLError('존재하지 않는 회원', ERROR.INVALID_USER);

    const compared: boolean = await bcrypt.compare(
      userInfo.password,
      user.password,
    );
    if (!compared)
      throw new GraphQLError('유효하지 않은 비밀번호', ERROR.INVALID_PASSWORD);

    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: '7200s',
      },
    );
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: '604800s',
      },
    );

    // TODO: 만료시간 계산 후에 만료가 안됐을 때, update 해주는 걸로 수정
    /**
     * 지금은 refreshToken이 있으면 만료기간 생각안하고 바로 로그인됨
     */
    if (!user.refreshToken.length) {
      const logger = new Logger('TOKEN');
      await this.usersDao.registerRefreshToken(user.id, refreshToken);
      logger.debug('Updated refresh token');
    }

    /**
     * hint
     */
    // const verifiedToken = this.jwtService.verify(user.refreshToken);
    // console.log(date >= new Date(verifiedToken.exp * 1000));

    return accessToken;
  }
}
