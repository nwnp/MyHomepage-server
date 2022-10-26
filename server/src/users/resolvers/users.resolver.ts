import { UsersDao } from './../dao/users.dao';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ERROR } from '../../common/constant/error-handling';
import { UserSignupDto } from '../dto/signup.dto';
import { User } from 'src/common/databases/users.entity';

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

  @Mutation(() => User)
  async signup(@Args('user') user: UserSignupDto) {
    const { email, password, nickname } = user;
    console.log(user);

    return user;
  }
}
