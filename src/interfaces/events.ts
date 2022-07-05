import { AnyObject, EventTypes } from '@wspro/ets-client';

export class EventEntity {
  tracer: string | null = null;
  span: string | null = null;
  time: number | null = null;
  name: string | null = null;
  data: AnyObject = {};
  thread: string | null = null;
  type: EventTypes | null = null;
}
