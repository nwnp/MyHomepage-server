import { GraphQLError } from 'graphql';
import { UsersDao } from '../users/dao/users.dao';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'src/common/databases/users.entity';
import { ERROR } from 'src/common/constant/error-handling';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersDao: UsersDao) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload): Promise<User | Error> {
    const user = await this.usersDao.getUserById(payload.id);
    if (!user)
      return new GraphQLError('유효하지 않은 회원', ERROR.INVALID_USER);
    return user;
  }
}
