import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostResolver } from './resolvers/posts.resolver';
import { PostsService } from './services/posts.service';
import { Post } from 'src/common/databases/posts.entity';
import { UsersModule } from 'src/users/users.module';
import { PostsDao } from './dao/posts.dao';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule],
  providers: [PostsService, PostResolver, PostsDao],
})
export class PostsModule {}
