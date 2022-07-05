import { Module } from '@nestjs/common';

import { KafkaModule } from '../modules/kafka/kafka.module';
import { StorageModule } from '../modules/storage/storage.module';
import { AppService } from './app.service';

@Module({
  exports: [StorageModule],
  imports: [StorageModule, KafkaModule],
  providers: [AppService],
})
export class AppModule {}
