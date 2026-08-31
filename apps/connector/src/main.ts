import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger, reasonOf } from './common/logger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  logger.info('Connector iniciado. Listo para consumir.');

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Señal ${signal} recibida. Cerrando...`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason: unknown) => {
    logger.error(`Rechazo de promesa no manejado: ${reasonOf(reason)}`);
    process.exit(1);
  });
}

void bootstrap().catch((error: unknown) => {
  const reason = error instanceof Error ? error.message : String(error);
  logger.error(`Error fatal en el arranque: ${reason}`);
  process.exit(1);
});
