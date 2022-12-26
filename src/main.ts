import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function start() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.SERVER_PORT;
  const ENV = process.env.NODE_ENV;

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  if (process.env.NODE_ENV === 'production') app.use(helmet());

  await app.listen(PORT, () => {
    const logger = new Logger('MAIN');
    logger.verbose(`The server is running at ${PORT}:${ENV}`);
  });
}

start();
