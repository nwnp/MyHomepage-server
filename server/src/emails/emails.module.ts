import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EmailsService } from './services/emails.service';
import { EmailsResolver } from './resolvers/emails.resolver';
import { EmailDao } from './dao/email.dao';
import { Email } from 'src/common/databases/emails.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Email]), UsersModule],
  providers: [EmailsService, EmailsResolver, EmailDao],
})
export class EmailsModule {}
