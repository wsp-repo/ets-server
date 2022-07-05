import { Controller } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import {
  AddEventPayload,
  AnyObject,
  InitTracerPayload,
  LoadSpanPayload,
  Patterns,
  SetAttrPayload,
  StartSpanPayload,
  StopSpanPayload,
} from '@wspro/ets-client';

import { KafkaService } from './kafka.service';

interface Message {
  batchContext: {
    firstTimestamp: number;
  };
  timestamp: number;
  value: unknown;
}

@Controller()
export class KafkaController {
  constructor(private readonly service: KafkaService) {}

  @MessagePattern(Patterns.InitTracer, Transport.KAFKA)
  public initTracer(@Payload() message: Message): Promise<void> {
    return this.service.initTracer(this.getValue<InitTracerPayload>(message));
  }

  @EventPattern(Patterns.SetAttrs, Transport.KAFKA)
  public setAttrs(@Payload() message: Message): void {
    this.service.setAttrs(this.getValue<SetAttrPayload[]>(message));
  }

  @EventPattern(Patterns.AddEvent, Transport.KAFKA)
  public addEvent(@Payload() message: Message): void {
    this.service.addEvent(this.getValue<AddEventPayload>(message));
  }

  @EventPattern(Patterns.StartSpan, Transport.KAFKA)
  public startSpan(@Payload() message: Message): void {
    this.service.startSpan(this.getValue<StartSpanPayload>(message));
  }

  @EventPattern(Patterns.LoadSpan, Transport.KAFKA)
  public loadSpan(@Payload() message: Message): void {
    this.service.loadSpan(this.getValue<LoadSpanPayload>(message));
  }

  @EventPattern(Patterns.StopSpan, Transport.KAFKA)
  public stopSpan(@Payload() message: Message): void {
    this.service.stopSpan(this.getValue<StopSpanPayload>(message));
  }

  /**
   * Возвращает типизированный пэйлоад
   */
  private getValue<T = AnyObject>(message: Message): T {
    const { batchContext, timestamp, value } = message;
    const { firstTimestamp } = batchContext || {};

    const time = firstTimestamp || timestamp;

    return Array.isArray(value)
      ? (value.map((v) => ({ ...v, time })) as unknown as T)
      : { ...(value as T), time };
  }
}
