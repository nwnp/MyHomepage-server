import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserSignupModel } from '../models/user.signup.model';
import { User } from 'src/common/databases/users.entity';
import { UserUpdateModel } from '../models/user.update.model';
import { UserCheckModel } from '../models/user.check.model';
import { UserLoginModel } from '../models/user.login.model';
import { UsersService } from '../services/users.service';

@Resolver('user')
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  async me(@Args({ name: 'id', type: () => Int }) id: number) {
    return this.usersService.me(id);
  }

  @Query(() => [User])
  async allUser() {
    return this.usersService.allUser();
  }

  @Query(() => User)
  async searchUser(@Args('nickname') nickname: string) {
    return this.usersService.searchUser(nickname);
  }

  @Query(() => User)
  async login(@Args('userInfo') userInfo: UserLoginModel) {
    return this.usersService.login(userInfo);
  }

  @Query(() => User)
  async userCheck(@Args('userInfo') userInfo: UserCheckModel) {
    return this.usersService.userCheck(userInfo);
  }

  @Mutation(() => User)
  async signup(@Args('user') user: UserSignupModel) {
    return this.usersService.signup(user);
  }

  @Mutation(() => User)
  async updateUser(@Args('user') user: UserUpdateModel) {
    return this.usersService.updateUser(user);
  }
}
