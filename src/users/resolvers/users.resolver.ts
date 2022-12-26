import { GqlAuthGuard } from '../../auth/guard/gql.auth.guard';
import { AuthService } from '../../auth/services/auth.service';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserSignupModel } from '../models/user.signup.model';
import { User } from 'src/common/databases/users.entity';
import { UserUpdateModel } from '../models/user.update.model';
import { UserCheckModel } from '../models/user.check.model';
import { UserLoginInput } from '../models/user.login.model';
import { UsersService } from '../services/users.service';
import { IUserToken } from 'src/common/interfaces/user.interface';
import { Token } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/functions/current.user';
import { UserFindModel } from '../models/user.find.model';

@Resolver('user')
export class UserResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(
    @Args({ name: 'id', type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.usersService.me(id);
  }

  @Query(() => [User])
  async allUser(): Promise<User[]> {
    return this.usersService.allUser();
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async userFind(
    @Args('user') user: UserFindModel,
    @CurrentUser() userInfo: User,
  ): Promise<User> {
    return this.usersService.userFind(user);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async searchUserByNickname(
    @Args('nickname') nickname: string,
  ): Promise<User[]> {
    return await this.usersService.searchUserByNickname(nickname);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async searchUserByEmail(@Args('email') email: string): Promise<User> {
    return await this.usersService.searchUserByEmail(email);
  }

  @Mutation(() => Token)
  async login(@Args('userInfo') userInfo: UserLoginInput): Promise<IUserToken> {
    return await this.authService.validateUser(userInfo);
  }

  @Query(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async userCheck(
    @Args('userInfo') userInfo: UserCheckModel,
  ): Promise<boolean> {
    return this.usersService.userCheck(userInfo);
  }

  @Mutation(() => User)
  async signup(@Args('user') user: UserSignupModel): Promise<User> {
    return this.usersService.signup(user);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('user') user: UserUpdateModel,
    @CurrentUser() userInfo: User,
  ): Promise<boolean> {
    return (await this.usersService.updateUser(user, userInfo.id)).affected
      ? true
      : false;
  }
}
