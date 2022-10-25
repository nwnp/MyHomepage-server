import { HttpExceptionFilter } from './../../common/exceptions/http-exception.filter';
import { Injectable, UseFilters, HttpException } from '@nestjs/common';
import { UsersDao } from '../dao/users.dao';

@Injectable()
@UseFilters(new HttpExceptionFilter())
export class UsersService {
  constructor(private readonly usersDao: UsersDao) {}

  async getMe(id: number) {
    const user = await this.usersDao.getUserById(id);
    if (!user) throw new HttpException('존재하지 않는 회원', 404);

    return {
      success: true,
      user,
    };
  }
}
