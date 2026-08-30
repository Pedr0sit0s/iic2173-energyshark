import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueIdpk1788200000000 implements MigrationInterface {
    name = 'AddUniqueIdpk1788200000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_history_idpk" ON "history" ("idpk")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_history_idpk"`);
    }
}
