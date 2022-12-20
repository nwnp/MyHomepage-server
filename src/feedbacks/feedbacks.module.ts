import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FeedbacksService } from './services/feedbacks.service';
import { FeedbacksResolver } from './resolvers/feedbacks.resolver';
import { FeedbacksDao } from './dao/feedbacks.dao';
import { Feedback } from 'src/common/databases/feedback.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback]), UsersModule],
  providers: [FeedbacksService, FeedbacksResolver, FeedbacksDao],
})
export class FeedbacksModule {}
