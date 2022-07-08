import { getArray, getNumber, getString } from '@wspro/config';
import KnexClient, { Knex } from 'knex';

export const KNEX_INJECT = 'KNEX_INJECT';

/**
 * Готовит конфиг пула соединения
 */
function getPool(): Knex.PoolConfig {
  const cfgPool = getArray('ETS_POSTGRES_POOL') || [];
  const pool = cfgPool.map(Number).filter((v) => v > 0);

  if (pool.length < 1) pool.push(3);

  if (pool.length < 2) pool.push(Number(pool[0]) * 2);

  return { max: Math.max(...pool), min: Math.min(...pool) };
}

/**
 * Готовит конфиг соединения с базой
 */
function getConnection(): Knex.PgConnectionConfig {
  return {
    database: getString('ETS_POSTGRES_BASE'),
    host: getString('ETS_POSTGRES_HOST', 'localhost'),
    password: getString('ETS_POSTGRES_PASS'),
    port: getNumber('ETS_POSTGRES_PORT', 5432),
    user: getString('ETS_POSTGRES_USER'),
  };
}

// eslint-disable-next-line
export const KnexFactory = {
  provide: KNEX_INJECT,
  useFactory: (): Knex => {
    return KnexClient({
      client: 'pg',
      connection: getConnection(),
      pool: getPool(),
    });
  },
};
