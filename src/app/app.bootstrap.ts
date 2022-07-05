import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getClientOptionsForKafkaTransport } from '@wspro/ets-client';

import { AppModule } from './app.module';

/**
 * Инициирует сервис
 */
export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(
    getClientOptionsForKafkaTransport(),
  );

  await app.startAllMicroservices();
  await app.init();
}
