import { CommentsModule } from './../comments/comments.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitLog } from 'src/common/databases/visit-logs.entity';
import { Post } from 'src/common/databases/posts.entity';
import { BGM } from 'src/common/databases/bgms.entity';
import { User } from 'src/common/databases/users.entity';
import { LoggerMiddle } from 'src/common/middlewares/logger.middleware';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Comment } from 'src/common/databases/comment.entity';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { PostsModule } from 'src/posts/posts.module';
import { PostComment } from 'src/common/databases/post-comment.entity';
import { FollowsModule } from 'src/follows/follows.module';
import { Follow } from 'src/common/databases/follows.entity';
import { CalendarsModule } from 'src/calendars/calendars.module';
import { Calendar } from 'src/common/databases/calendars.entity';
import { Til } from 'src/common/databases/tils.entity';
import { TilsModule } from 'src/tils/tils.module';
import { TilComment } from 'src/common/databases/til-comments.entity';
import { Email } from 'src/common/databases/emails.entity';
import { EmailsModule } from 'src/emails/emails.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
        },
        auth: {
          user: 'ujmn0418@gmail.com',
          pass: 'googlednwjdwls1!@AS',
        },
        preview: true,
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host:
        process.env.NODE_ENV === 'production'
          ? process.env.RDS_ENDPOINT
          : 'localhost',
      port: process.env.NODE_ENV === 'production' ? 3306 : 3305,
      username:
        process.env.NODE_ENV === 'production'
          ? process.env.RDS_USER
          : process.env.DB_USER,
      password:
        process.env.NODE_ENV === 'production'
          ? process.env.RDS_PASSWORD
          : process.env.DB_PASSWORD,
      database:
        process.env.NODE_ENV === 'production'
          ? process.env.RDS_SCHEMA
          : process.env.DB_SCHEMA,
      entities: [
        User,
        Post,
        VisitLog,
        BGM,
        Comment,
        PostComment,
        Follow,
        Calendar,
        Til,
        TilComment,
        Email,
      ],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: process.env.NODE_ENV === 'production' ? false : true,
      typePaths: ['./**/*.graphql'],
      cors: {
        origin: [
          process.env.NODE_ENV === 'production'
            ? 'https://my-page.co.kr'
            : 'http://localhost:8081',
        ],
        credentials: true,
      },
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
    FollowsModule,
    CalendarsModule,
    TilsModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddle).forRoutes('*');
  }
}
