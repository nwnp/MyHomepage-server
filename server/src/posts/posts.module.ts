import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';

@Module({
  providers: [PostsService],
})
export class PostsModule {}
