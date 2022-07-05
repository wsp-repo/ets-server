import { Global, Module } from '@nestjs/common';

import { StorageQueries } from './storage.queries';
import { StorageService } from './storage.service';

@Global()
@Module({
  exports: [StorageService],
  providers: [StorageService, StorageQueries],
})
export class StorageModule {}
