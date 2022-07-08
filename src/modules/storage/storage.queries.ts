import { Injectable } from '@nestjs/common';
import { EventTypes } from '@wspro/ets-client';
import { Knex } from 'knex';

import { KnexQueries } from '../../common/knex/knex.queries';

import {
  AttrEntity,
  EventEntity,
  SpanEntity,
  TracerEntity,
} from '../../interfaces';

@Injectable()
export class StorageQueries extends KnexQueries {
  /**
   * Добавляет в трекинг трейсер
   */
  public insertTracer(tracer: TracerEntity): Knex.QueryBuilder {
    return this.knex('ets_tracers').insert(tracer);
  }

  /**
   * Добавляет в трекинг спаны, которых еще нет
   * - обновляет часть полей у существующего
   * - автоопределяет значение поля "end"
   */
  public upsertSpans(spans: SpanEntity[]): Knex.QueryBuilder {
    const name = this.knex.raw(
      'case when ?? < ?? and length(??) > 0 then ?? else ?? end',
      [
        'excluded.time',
        'ets_spans.time',
        'excluded.name',
        'excluded.name',
        'ets_spans.name',
      ],
    );

    const time = this.knex.raw('case when ?? < ?? then ?? else ?? end', [
      'excluded.time',
      'ets_spans.time',
      'excluded.time',
      'ets_spans.time',
    ]);

    const tracer = this.knex.raw('case when ?? < ?? then ?? else ?? end', [
      'excluded.time',
      'ets_spans.time',
      'excluded.tracer',
      'ets_spans.tracer',
    ]);

    const end = this.knex('ets_events')
      .first(
        this.knex.raw('case when ?? = ? then ?? else null end', [
          'ets_events.type',
          EventTypes.Stop,
          'ets_events.time',
        ]),
      )
      .whereRaw('?? = ??', ['ets_events.span', 'ets_spans.span'])
      .orderBy('ets_events.time', 'desc');

    return this.knex('ets_spans')
      .insert(spans)
      .onConflict('span')
      .merge({ end, name, time, tracer });
  }

  /**
   * Добавляет в трекинг атрибуты
   */
  public insertAttrs(attrs: AttrEntity[]): Knex.QueryBuilder {
    return this.knex('ets_attrs').insert(attrs);
  }

  /**
   * Добавляет в трекинг события
   */
  public insertEvents(events: EventEntity[]): Knex.QueryBuilder {
    return this.knex('ets_events').insert(
      events.map(({ data, ...row }) => ({
        data: JSON.stringify(data || {}),
        ...row,
      })),
    );
  }
}
