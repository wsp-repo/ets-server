import { Injectable } from '@nestjs/common';
import { EventTypes } from '@wspro/ets-client';

import { assignObject } from '../helpers';
import { StorageQueries } from './storage.queries';

import {
  AttrEntity,
  EventEntity,
  SpanEntity,
  TracerEntity,
} from '../../interfaces';

@Injectable()
export class StorageService {
  private saveTime = 0;

  private saveLocked: NodeJS.Timeout | undefined = undefined;

  private spansBuffer = new Set<SpanEntity>();

  private attrsBuffer = new Set<AttrEntity>();

  private eventsBuffer = new Set<EventEntity>();

  constructor(private readonly queries: StorageQueries) {}

  /**
   * Принимает трейсер для записи в базу
   * - создать запись трейсера в БД нужно сразу
   */
  public async initTracer(tracer: TracerEntity): Promise<void> {
    await this.queries.insertTracer(tracer);
  }

  /**
   * Принимает запуск спана для записи в базу
   */
  public startSpan(span: SpanEntity): void {
    this.spanEvent(span, EventTypes.Start);
    this.spansBuffer.add(span);

    this.checkSaveBuffers();
  }

  /**
   * Принимает запуск спана для записи в базу
   */
  public loadSpan(span: SpanEntity): void {
    this.spanEvent(span, EventTypes.Load);
    this.spansBuffer.add(span);

    this.checkSaveBuffers();
  }

  /**
   * Принимает остановку спана для записи в базу
   */
  public stopSpan(span: SpanEntity): void {
    this.spanEvent(span, EventTypes.Stop);
    this.spansBuffer.add(span);

    this.checkSaveBuffers();
  }

  /**
   * Обновляет атрибуты юнита
   */
  public setAttrs(attrs: AttrEntity[]): void {
    attrs.forEach((attr) => this.attrsBuffer.add(attr));

    this.checkSaveBuffers();
  }

  /**
   * Принимает трейсер для записи в базу
   */
  public addEvent(event: EventEntity): void {
    this.eventsBuffer.add(event);

    this.checkSaveBuffers();
  }

  /**
   * Добавляет событие изменения статуса спана
   */
  private spanEvent(span: SpanEntity, type: EventTypes): void {
    const rawEvent = { ...span, name: `Change status [${type}]`, type };

    this.eventsBuffer.add(assignObject(new EventEntity(), rawEvent));
  }

  /**
   * Проверяет условия для записи данных буферов
   */
  private checkSaveBuffers(): void {
    if (this.saveLocked) return;

    const wasSaved = Date.now() - this.saveTime;
    const saveWait = Math.max(500 - wasSaved, 50);

    this.saveLocked = setTimeout(async () => {
      this.saveTime = Date.now();

      await this.saveBuffers();

      clearTimeout(this.saveLocked);
      this.saveLocked = undefined;

      this.checkSaveBuffers();
    }, saveWait);
  }

  /**
   * Сбрасывает накопленные данные по таймеру
   */
  private async saveBuffers(): Promise<void> {
    try {
      const spans = this.getBufferForSave(this.spansBuffer);
      const events = this.getBufferForSave(this.eventsBuffer);
      const attrs = this.getBufferForSave(this.attrsBuffer);

      await Promise.all([
        attrs.length > 0 ? this.saveBufferAttrs(attrs) : null,
        events.length > 0 ? this.saveBufferEvents(events) : null,
      ]);

      // такой порядок записи нужен для автоопределения реального
      // состояния закрытости спана по набору событий на start/stop
      if (spans.length > 0) await this.saveBufferSpans(spans);
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Сбрасывает данные по атрибутам в базу
   */
  private async saveBufferAttrs(attrs: AttrEntity[]): Promise<void> {
    await this.queries.insertAttrs(attrs).catch((error) => {
      console.error(`Error: `, error);
      console.warn(attrs);
    });
  }

  /**
   * Сбрасывает данные по событиям в базу
   */
  private async saveBufferEvents(events: EventEntity[]): Promise<void> {
    await this.queries.insertEvents(events).catch((error) => {
      console.error(`Error: `, error);
      console.warn(events);
    });
  }

  /**
   * Сбрасывает данные по спанам в базу
   */
  private async saveBufferSpans(spans: SpanEntity[]): Promise<void> {
    await this.queries.upsertSpans(spans).catch((error) => {
      console.error(`Error: `, error);
      console.warn(spans);
    });
  }

  /**
   * Возвращает данные буфера для записи
   */
  private getBufferForSave<T>(buffer: Set<T>): T[] {
    const data = buffer.size > 0 ? [...buffer] : [];

    if (data.length > 0) buffer.clear();

    return data;
  }
}
