import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateConfig } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { HistoryModule } from './history/history.module';

const ENV_FILE = join(__dirname, '..', '..', '..', '.env');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [ENV_FILE],
      validate: validateConfig,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),

        autoLoadEntities: true,
        synchronize: false,

        ssl:
          config.get<string>('DB_SSL') === 'true'
            ? // TODO(seguridad): RDS cifra la conexión pero aquí NO se valida el
              // certificado del servidor. Para verificar el CA de RDS hay que
              // empaquetar el bundle (p. ej. rds-ca-rsa2048-g1.pem) y usar
              // `{ ca: <buffer>, rejectUnauthorized: true }`. No se habilita por
              // defecto para no romper la conexión de producción sin antes
              // validar el certificado real de la instancia RDS.
              { rejectUnauthorized: false }
            : undefined,

        retryAttempts: 5,
        retryDelay: 1000,
      }),
    }),

    HistoryModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
