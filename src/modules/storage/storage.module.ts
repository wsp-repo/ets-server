import { Global, Module } from '@nestjs/common';

import { StorageService } from './storage.service';
import { StorageQueries } from './storage.queries';

@Global()
@Module({
  exports: [StorageService],
  providers: [StorageService, StorageQueries],
})
export class StorageModule {}
