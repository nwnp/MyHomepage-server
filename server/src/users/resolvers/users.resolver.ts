import { Query, Resolver } from '@nestjs/graphql';

@Resolver('user')
export class UserResolver {
  @Query()
  async me() {
    return {
      id: 1,
      email: 'ujmn0418@gmail.com',
      password: '1234',
      job: 'full-stack developer',
      gender: 'male',
      nickname: 'nwnp',
      githubUrl: 'https://github.com/nwnp',
      blogUrl: 'https://cpp.tistory.com',
    };
  }
}
