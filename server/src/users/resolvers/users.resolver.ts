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
  async me(@Args({ name: 'id', type: () => Int }) id: number): Promise<User> {
    return this.usersService.me(id);
  }

  @Query(() => [User])
  async allUser(): Promise<User[]> {
    return this.usersService.allUser();
  }

  @Query(() => User)
  async searchUser(@Args('nickname') nickname: string): Promise<User> {
    return this.usersService.searchUser(nickname);
  }

  // TODO: return 수정
  // @Query(() => User)
  @Query()
  async login(@Args('userInfo') userInfo: UserLoginModel): Promise<string> {
    return this.usersService.login(userInfo);
  }

  @Query(() => Boolean)
  async userCheck(
    @Args('userInfo') userInfo: UserCheckModel,
  ): Promise<boolean> {
    return this.usersService.userCheck(userInfo);
  }

  @Mutation(() => User)
  async signup(@Args('user') user: UserSignupModel): Promise<User> {
    return this.usersService.signup(user);
  }

  // TODO: return 수정
  @Mutation(() => User)
  async updateUser(@Args('user') user: UserUpdateModel): Promise<any> {
    return this.usersService.updateUser(user);
  }
}
