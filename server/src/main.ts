import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function start() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.SERVER_PORT;

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => {
    const logger = new Logger('MAIN');
    logger.log(`The server is running at ${PORT}`);
  });
}

start();
