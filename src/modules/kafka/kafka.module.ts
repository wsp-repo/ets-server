import { Module } from '@nestjs/common';

import { StorageModule } from '../storage/storage.module';
import { KafkaController } from './kafka.controller';
import { KafkaService } from './kafka.service';

@Module({
  controllers: [KafkaController],
  imports: [StorageModule],
  providers: [KafkaService],
})
export class KafkaModule {}
