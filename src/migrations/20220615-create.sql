/**
 * Таблица источников
 */
CREATE TABLE "public"."ets_tracers" (
  "tracer" uuid NOT NULL,
  "time" bigint NOT NULL,
  "name" varchar(200) NOT NULL,
  CONSTRAINT "ets_tracers_uuid_pk" PRIMARY KEY ("tracer")
);


/**
 * Таблица спанов
 */
CREATE TABLE "public"."ets_spans" (
  "span" uuid NOT NULL,
  "time" bigint NOT NULL,
  "name" varchar(200) NOT NULL,
  "end" bigint NULL,
  "tracer" uuid NOT NULL,
  "parent" uuid NULL,
  "thread" uuid NULL,
  CONSTRAINT "ets_spans_uuid_pk" PRIMARY KEY ("span")
);

ALTER TABLE "public"."ets_spans" ADD CONSTRAINT "ets_spans_tracer_fk" FOREIGN KEY ("tracer")
  REFERENCES "public"."ets_tracers"("tracer") ON DELETE CASCADE ON UPDATE CASCADE;


/**
 * Таблица атрибутов
 */
CREATE TABLE "public"."ets_attrs" (
  "time" bigint NOT NULL,
  "name" varchar(200) NOT NULL,
  "value" text NOT NULL,
  "tracer" uuid NOT NULL,
  "span" uuid NULL,
  "thread" uuid NULL
);

CREATE INDEX "ets_attrs_span_idx" ON "public"."ets_attrs" USING btree ("span");

ALTER TABLE "public"."ets_attrs" ADD CONSTRAINT "ets_attrs_tracer_fk" FOREIGN KEY ("tracer")
  REFERENCES "public"."ets_tracers"("tracer") ON DELETE CASCADE ON UPDATE CASCADE;


/**
 * Таблица событий
 */
CREATE TYPE "ets_events_types" AS ENUM(
  'start', 'stop', 'load', 'error', 'event'
);

CREATE TABLE "public"."ets_events" (
  "time" bigint NOT NULL,
  "name" varchar(200),
  "type" ets_events_types NOT NULL DEFAULT 'event',
  "data" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "tracer" uuid NOT NULL,
  "span" uuid NULL,
  "thread" uuid NULL
);

CREATE INDEX "ets_events_span_idx" ON "public"."ets_events" USING btree ("span");

ALTER TABLE "public"."ets_events" ADD CONSTRAINT "ets_events_tracer_fk" FOREIGN KEY ("tracer")
  REFERENCES "public"."ets_tracers"("tracer") ON DELETE CASCADE ON UPDATE CASCADE;
