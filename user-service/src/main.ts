import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const logger = new Logger('Main');

// create the microservice option
const microserviceOption = {
  transport: Transport.TCP,
  options: {
    host: '127.0.0.1',
    port: 8877,
  },
};

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOption,
  );
  app.listen(() => {
    logger.log('Micro service is listening...');
  });
  // app.enableCors();
  // await app.listen(parseInt(process.env.SERVER_PORT) || 10000);
}
bootstrap();
