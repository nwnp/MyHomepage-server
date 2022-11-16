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

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3305,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
      entities: [User, Post, VisitLog, BGM, Comment, PostComment],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: true,
      typePaths: ['./**/*.graphql'],
      cors: {
        origin: 'http://localhost:8081',
        credentials: true,
      },
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddle).forRoutes('*');
  }
}
