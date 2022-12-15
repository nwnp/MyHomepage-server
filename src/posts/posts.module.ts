import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { PostResolver } from './resolvers/posts.resolver';
import { PostsService } from './services/posts.service';
import { Post } from 'src/common/databases/posts.entity';
import { UsersModule } from 'src/users/users.module';
import { PostsDao } from './dao/posts.dao';
import { PostComment } from 'src/common/databases/post-comment.entity';
import { CalendarsModule } from 'src/calendars/calendars.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostComment]),
    UsersModule,
    forwardRef(() => CalendarsModule),
  ],
  providers: [PostsService, PostResolver, PostsDao],
  exports: [PostsDao],
})
export class PostsModule {}
