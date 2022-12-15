import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsResolver } from './resolvers/comments.resolver';
import { CommentsService } from './services/comments.service';
import { Comment } from 'src/common/databases/comment.entity';
import { CommentsDao } from './dao/comments.dao';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentsResolver, CommentsService, CommentsDao],
})
export class CommentsModule {}
