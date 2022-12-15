import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Email } from 'src/common/databases/emails.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class EmailDao {
  private readonly logger = new Logger('EMAIL-DB');
  constructor(
    @InjectRepository(Email)
    private readonly emailsRepository: Repository<Email>,
    private readonly dataSource: DataSource,
  ) {}
}
