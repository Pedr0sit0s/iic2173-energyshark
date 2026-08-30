import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AmqpModule } from './amqp/amqp.module';
import { validateConfig } from './config/env.validation';

// En dev (src) __dirname = apps/connector/src; en prod (dist) = apps/connector/dist.
// Con `../..` se llega a la raíz del repo; con `..` al .env local del connector.
const ENV_FILES = [
  join(__dirname, '..', '..', '..', '.env'),
  join(__dirname, '..', '.env'),
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV_FILES,
      validate: validateConfig,
    }),
    AmqpModule,
  ],
})
export class AppModule {}
