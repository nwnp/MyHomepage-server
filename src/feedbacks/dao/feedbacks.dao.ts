import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from 'src/common/databases/feedback.entity';
import { Repository, DataSource } from 'typeorm';
import { FeedbackRegisterModel } from '../models/feedback.register.model';

@Injectable()
export class FeedbacksDao {
  private readonly logger = new Logger('FEEDBACK-DB');
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbacksRepository: Repository<Feedback>,
    private readonly dataSource: DataSource,
  ) {}

  async registerFeedback(feedback: FeedbackRegisterModel): Promise<boolean> {
    try {
      const newFeedback = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Feedback)
        .values({
          UserId: feedback.UserId,
          title: feedback.title,
          content: feedback.content,
        })
        .execute();
      this.logger.verbose('피드백 저장 완료');
      return newFeedback.generatedMaps.length ? true : false;
    } catch (error) {
      console.log(error);
      this.logger.error('피드백 저장 에러');
    }
  }
}
