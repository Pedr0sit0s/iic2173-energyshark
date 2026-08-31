import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';

dotenv.config({ path: join(__dirname, '..', '..', '..', '.env') });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable "${name}".`);
  }
  return value;
}

function parsePort(name: string): number {
  const value = Number(process.env[name] ?? 5432);
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`Invalid ${name}: expected an integer port, got "${process.env[name]}".`);
  }
  return value;
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: requireEnv('DB_HOST'),
  port: parsePort('DB_PORT'),
  username: requireEnv('DB_USER'),
  password: requireEnv('DB_PASSWORD'),
  database: requireEnv('DB_NAME'),

  entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'migrations_history',

  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  // Same note as app.module.ts: DB_SSL cifra sin validar el CA de RDS.
  // Pendiente: empaquetar el bundle de CA y usar rejectUnauthorized: true.
  ssl: process.env.DB_SSL === 'true'
    ? { 
      ca: readFileSync(join(process.cwd(), 'apps', 'master', 'certs', 'global-bundle.pem')).toString(), 
      rejectUnauthorized: true 
    }
    : false,
});
