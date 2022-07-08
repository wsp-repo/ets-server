import { Global, Module } from '@nestjs/common';

import { KnexFactory } from './knex.factory';

@Global()
@Module({
  exports: [KnexFactory],
  providers: [KnexFactory],
})
export class KnexModule {}
