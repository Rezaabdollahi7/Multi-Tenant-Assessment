import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

const NODE_ENVIRONMENTS = ['development', 'production', 'test'] as const;

class EnvironmentVariables {
  @IsIn(NODE_ENVIRONMENTS)
  NODE_ENV!: (typeof NODE_ENVIRONMENTS)[number];

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3001;

  @IsString()
  POSTGRES_HOST!: string;

  @IsInt()
  POSTGRES_PORT!: number;

  @IsString()
  POSTGRES_USER!: string;

  @IsString()
  POSTGRES_PASSWORD!: string;

  @IsString()
  POSTGRES_DB!: string;

  @IsString()
  REDIS_HOST!: string;

  @IsInt()
  REDIS_PORT!: number;

  @IsString()
  @MinLength(32)
  ACCESS_TOKEN_SECRET!: string;

  @IsString()
  @MinLength(32)
  REFRESH_TOKEN_SECRET!: string;

  @IsInt()
  @Min(10)
  ACCESS_TOKEN_TTL_SECONDS: number = 900;

  @IsOptional()
  @Length(5, 5)
  @Matches(/^\d+$/)
  DEV_OTP?: string;

  @IsOptional()
  @IsString()
  CORS_ORIGIN?: string;
}

export type Environment = EnvironmentVariables;

export function validateEnvironment(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const environment = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(environment, { skipMissingProperties: false });

  if (errors.length > 0) {
    const details = errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${details}`);
  }

  return environment;
}
