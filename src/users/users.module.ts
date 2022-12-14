import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { User } from 'src/common/databases/users.entity';
import { UsersDao } from './dao/users.dao';
import { UserResolver } from './resolvers/users.resolver';
import { UsersService } from './services/users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  providers: [UsersDao, UserResolver, UsersService],
  exports: [UsersDao],
})
export class UsersModule {}
