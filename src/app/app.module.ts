import { Module } from '@nestjs/common';

import { EmulateModule } from '../emulate/emulate.module';
import { StorageModule } from '../modules/storage/storage.module';
import { KafkaModule } from '../modules/kafka/kafka.module';
import { AppService } from './app.service';

@Module({
  imports: [StorageModule, KafkaModule, EmulateModule],
  exports: [StorageModule],
  providers: [AppService],
})
export class AppModule {}
