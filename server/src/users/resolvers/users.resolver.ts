import { AuthService } from './../../auth/services/auth.service';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserSignupModel } from '../models/user.signup.model';
import { User } from 'src/common/databases/users.entity';
import { UserUpdateModel } from '../models/user.update.model';
import { UserCheckModel } from '../models/user.check.model';
import { UserLoginInput } from '../models/user.login.model';
import { UsersService } from '../services/users.service';
import { IUserToken } from 'src/common/interfaces/user.interface';
import { Token } from 'graphql';
import { UserLogoutModel } from '../models/user.logout.model';

@Resolver('user')
export class UserResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

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

  @Mutation(() => Token)
  async login(@Args('userInfo') userInfo: UserLoginInput): Promise<IUserToken> {
    const token = await this.authService.validateUser(userInfo);
    return token;
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

  @Mutation(() => Boolean)
  async logout(@Args('userId') userId: UserLogoutModel): Promise<boolean> {
    return (await this.usersService.logout(userId)).affected ? true : false;
  }

  @Mutation(() => User)
  async updateUser(@Args('user') user: UserUpdateModel): Promise<boolean> {
    return (await this.usersService.updateUser(user)).affected ? true : false;
  }
}
