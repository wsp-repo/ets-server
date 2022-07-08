import { Module } from '@nestjs/common';

import { KnexModule } from '../common/knex/knex.module';
import { KafkaModule } from '../modules/kafka/kafka.module';
import { StorageModule } from '../modules/storage/storage.module';
import { AppService } from './app.service';

@Module({
  exports: [KnexModule, StorageModule],
  imports: [KafkaModule, KnexModule, StorageModule],
  providers: [AppService],
})
export class AppModule {}
