import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostResolver } from './resolvers/posts.resolver';
import { PostsService } from './services/posts.service';
import { Post } from 'src/common/databases/posts.entity';
import { UsersModule } from 'src/users/users.module';
import { PostsDao } from './dao/posts.dao';
import { PostComment } from 'src/common/databases/post-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostComment]), UsersModule],
  providers: [PostsService, PostResolver, PostsDao],
})
export class PostsModule {}
