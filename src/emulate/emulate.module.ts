import { Module } from '@nestjs/common';
import { EtsModule } from '@wspro/ets-client';

import { EmulateService } from './emulate.service';

@Module({
  imports: [EtsModule],
  providers: [EmulateService],
})
export class EmulateModule {}
