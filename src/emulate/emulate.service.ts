import { Injectable, OnModuleInit } from '@nestjs/common';
import { EtsTracer, SpanContext } from '@wspro/ets-client';

@Injectable()
export class EmulateService implements OnModuleInit {
  constructor(private readonly tracer: EtsTracer) {}

  public async onModuleInit(): Promise<void> {
    await this.tracer.initTracer('Emulate 1', [
      { name: 'process.pid', value: process.pid },
      { name: 'process.platform', value: process.platform },
      { name: 'random.value', value: 999 },
    ]);

    this.startTracerEmulation();
    this.startSpanEmulation();
  }

  private startTracerEmulation(): void {
    setInterval(() => {
      this.tracer.setAttrs([
        {
          name: 'random.value',
          value: Math.round(Math.random() * 100),
        },
        {
          name: 'random.time',
          value: new Date().toString(),
        },
      ]);
    }, 11000);

    setInterval(() => {
      this.tracer.addEvent('Emulate Tracer Event', {
        date: new Date().toString(),
        rand: Math.round(Math.random() * 100),
      });
    }, 19000);
  }

  private startSpanEmulation(): void {
    let context: SpanContext | false = false;

    setInterval(async () => {
      const name = `Span ${Math.round(Math.random() * 100)}`;

      const span = context
        ? await this.tracer.loadSpan(context)
        : await this.tracer.startSpan(name, [
            {
              name: 'random.value',
              value: Math.round(Math.random() * 100),
            },
            {
              name: 'random.time',
              value: new Date().toString(),
            },
          ]);

      context = Math.random() > 0.6 && span.getContext();

      await new Promise((resolve) => setTimeout(resolve, 5000));

      span.addEvent('Emulate Span Event', {
        rand: Math.round(Math.random() * 100),
      });

      await new Promise((resolve) => setTimeout(resolve, 5000));

      span.stopSpan();
    }, 30000);
  }
}
