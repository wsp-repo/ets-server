import { AnyObject, EventTypes } from '@wspro/ets-client';

export class EventEntity {
  public tracer: string | null = null;

  public span: string | null = null;

  public time: number | null = null;

  public name: string | null = null;

  public data: AnyObject = {};

  public thread: string | null = null;

  public type: EventTypes | null = null;
}
