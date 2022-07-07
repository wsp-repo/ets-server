import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getKafkaOptions } from '@wspro/ets-client';

import { AppModule } from './app.module';

/**
 * Инициирует сервис
 */
export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(getKafkaOptions());

  await app.startAllMicroservices();
  await app.init();
}
