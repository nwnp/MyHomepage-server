import { IUserToken } from './../../common/interfaces/user.interface';
import { ERROR } from './../../common/constant/error-handling';
import { GraphQLError } from 'graphql';
import { UsersDao } from './../../users/dao/users.dao';
import { Injectable } from '@nestjs/common';
import { UserLoginInput } from 'src/users/models/user.login.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersDao: UsersDao,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userInfo: UserLoginInput): Promise<IUserToken> {
    const user = await this.usersDao.getUserByEmail(userInfo.email);
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

    return { accessToken };
  }
}
