import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

import { KNEX_INJECT } from './knex.factory';

@Injectable()
export class KnexQueries {
  constructor(@Inject(KNEX_INJECT) protected knex: Knex) {}
}
