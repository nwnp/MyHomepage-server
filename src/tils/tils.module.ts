import { Module } from '@nestjs/common';
import { TilsService } from './services/tils.service';
import { TilsResolver } from './resolvers/tils.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Til } from 'src/common/databases/tils.entity';
import { UsersModule } from 'src/users/users.module';
import { TilsDao } from './dao/tils.dao';
import { TilComment } from 'src/common/databases/til-comments.entity';
import { CalendarsModule } from 'src/calendars/calendars.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Til, TilComment]),
    UsersModule,
    CalendarsModule,
  ],
  providers: [TilsService, TilsResolver, TilsDao],
  exports: [TilsDao],
})
export class TilsModule {}
