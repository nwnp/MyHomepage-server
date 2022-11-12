import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/common/databases/comment.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class CommentsDao {
  private readonly logger = new Logger('COMMENT-DB');
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly dataSource: DataSource,
  ) {}

  // TODO: CRUD

  // Create
  async registerComment() {}

  // Read
  async getComments() {}

  // Update
  async updateComment() {}

  // Delete
  async deleteComment() {}
}
