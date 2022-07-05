import { Injectable } from '@nestjs/common';
import {
  SetAttrPayload,
  AddEventPayload,
  InitTracerPayload,
  StartSpanPayload,
  LoadSpanPayload,
  StopSpanPayload,
} from '@wspro/ets-client';

import { StorageService } from '../storage/storage.service';

import {
  AttrEntity,
  TracerEntity,
  EventEntity,
  SpanEntity,
} from '../../interfaces';

@Injectable()
export class KafkaService {
  constructor(private readonly storage: StorageService) {}

  /**
   * Инициализирует через стор трейсер
   */
  public async initTracer(payload: InitTracerPayload): Promise<void> {
    try {
      const { attrs = [], ...rawTracer } = payload;

      await this.storage.initTracer(
        this.getEntity(new TracerEntity(), rawTracer),
      );

      this.setAttrs(attrs.map((item) => ({ ...rawTracer, ...item })));
    } catch (error) {
      console.warn('KafkaService.initTracer: ', error);
    }
  }

  /**
   * Передает в стор запуск спана
   */
  public async startSpan(payload: StartSpanPayload): Promise<void> {
    try {
      const { attrs = [], ...rawSpan } = payload;

      this.storage.startSpan(this.getEntity(new SpanEntity(), rawSpan));
      this.setAttrs(attrs.map((item) => ({ ...rawSpan, ...item })));
    } catch (error) {
      console.warn('KafkaService.startSpan: ', error);
    }
  }

  /**
   * Передает в стор загрузку спана
   */
  public async loadSpan(payload: LoadSpanPayload): Promise<void> {
    try {
      const { attrs = [], ...rawSpan } = payload;

      this.storage.loadSpan(this.getEntity(new SpanEntity(), rawSpan));
      this.setAttrs(attrs.map((item) => ({ ...rawSpan, ...item })));
    } catch (error) {
      console.warn('KafkaService.loadSpan: ', error);
    }
  }

  /**
   * Передает в стор завершение спана
   */
  public async stopSpan(payload: StopSpanPayload): Promise<void> {
    try {
      this.storage.stopSpan(this.getEntity(new SpanEntity(), payload));
    } catch (error) {
      console.warn('KafkaService.stopSpan: ', error);
    }
  }

  /**
   * Передает в стор установку аттрибутов
   */
  public setAttrs(payload: SetAttrPayload[]): void {
    try {
      this.storage.setAttrs(
        payload.map((item) => this.getEntity(new AttrEntity(), item)),
      );
    } catch (error) {
      console.warn('KafkaService.setAttrs: ', error);
    }
  }

  /**
   * Передает в стор регистрацию события
   */
  public addEvent(payload: AddEventPayload): void {
    try {
      this.storage.addEvent(this.getEntity(new EventEntity(), payload));
    } catch (error) {
      console.warn('KafkaService.addEvent: ', error);
    }
  }

  /**
   * Возвращает готовое ентити с данными
   * - пока варианта лучше не придумал
   */
  private getEntity<T>(entity: T, data: unknown): T {
    const entityData = data as T;

    for (const prop in entity) {
      if (entityData[prop] !== undefined) {
        entity[prop] = entityData[prop];
      }
    }

    return entity;
  }
}
