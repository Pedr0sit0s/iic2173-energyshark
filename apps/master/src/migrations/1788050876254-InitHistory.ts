import { MigrationInterface, QueryRunner } from "typeorm";

export class InitHistory1788050876254 implements MigrationInterface {
    name = 'InitHistory1788050876254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
        await queryRunner.query(`CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "idpk" uuid NOT NULL, "type" text NOT NULL, "receivedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "validUntil" TIMESTAMP WITH TIME ZONE, "packageBody" jsonb NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id")); COMMENT ON COLUMN "history"."idpk" IS 'UUID del evento asignado por el curso (idpk)'; COMMENT ON COLUMN "history"."type" IS 'Tipo del evento, p. ej. demand-set'; COMMENT ON COLUMN "history"."receivedAt" IS 'Instante en que master recibió el evento (UTC)'; COMMENT ON COLUMN "history"."validUntil" IS 'Vigencia del dato, si aplica'; COMMENT ON COLUMN "history"."packageBody" IS 'Payload original del evento'; COMMENT ON COLUMN "history"."createdAt" IS 'Fecha de creación del registro'`);
        await queryRunner.query(`CREATE INDEX "IDX_history_type" ON "history"  ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_history_received_at" ON "history"  ("receivedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_history_valid_until" ON "history"  ("validUntil") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_history_valid_until"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_history_received_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_history_type"`);
        await queryRunner.query(`DROP TABLE "history"`);
    }

}
