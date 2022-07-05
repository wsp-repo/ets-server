import { NestFactory } from '@nestjs/core';
import { KafkaOptions, MicroserviceOptions } from '@nestjs/microservices';
import { getClientOptionsForKafkaTransport } from '@wspro/ets-client';

import { AppModule } from './app.module';

/**
 * Инициирует сервис
 */
export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(
    getClientOptionsForKafkaTransport() as KafkaOptions,
  );

  await app.startAllMicroservices();
  await app.init();
}
