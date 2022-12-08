import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';

async function start() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.SERVER_PORT;

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  await app.listen(PORT, () => {
    const logger = new Logger('MAIN');
    logger.verbose(`The server is running at ${PORT}`);
  });
}

start();
