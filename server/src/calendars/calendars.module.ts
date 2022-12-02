import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CalendarsResolver } from './resolvers/calendars.resolver';
import { CalendarsService } from './services/calendars.service';
import { Calendar } from 'src/common/databases/calendars.entity';
import { UsersModule } from 'src/users/users.module';
import { CalendarsDao } from './dao/calendars.dao';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar]), UsersModule, PostsModule],
  providers: [CalendarsResolver, CalendarsService, CalendarsDao],
})
export class CalendarsModule {}
