import { Global, Module } from '@nestjs/common';

import { KnexModule } from '../../common/knex/knex.module';
import { StorageQueries } from './storage.queries';
import { StorageService } from './storage.service';

@Global()
@Module({
  exports: [StorageService],
  imports: [KnexModule],
  providers: [StorageService, StorageQueries],
})
export class StorageModule {}
