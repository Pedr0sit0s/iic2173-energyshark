import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @IsUrl({ protocols: ['amqps', 'amqp'], require_tld: false })
  RABBITMQ_URL: string;

  @IsString()
  @MinLength(1)
  RABBITMQ_QUEUE: string;

  @IsString()
  @MinLength(8)
  INTERNAL_TOKEN: string;

  @IsString()
  @IsUrl({ require_tld: false })
  MASTER_URL: string;

  @IsOptional()
  @IsInt()
  @Min(1_000)
  @Max(60_000)
  REQUEST_TIMEOUT_MS?: number = 5_000;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  MAX_FORWARD_RETRIES?: number = 5;
}

export function validateConfig(config: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    whitelist: true,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    const details = errors
      .map(
        (error) =>
          `  - ${error.property}: ${Object.values(error.constraints ?? {}).join(', ')}`,
      )
      .join('\n');
    throw new Error(`Invalid environment variables:\n${details}`);
  }

  return validated;
}
