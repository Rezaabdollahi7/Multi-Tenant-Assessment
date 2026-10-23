import { NestFactory } from '@nestjs/core';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PLACEHOLDER_ENVIRONMENT: Record<string, string> = {
  NODE_ENV: 'development',
  POSTGRES_HOST: 'unused',
  POSTGRES_PORT: '5432',
  POSTGRES_USER: 'unused',
  POSTGRES_PASSWORD: 'unused',
  POSTGRES_DB: 'unused',
  REDIS_HOST: 'unused',
  REDIS_PORT: '6379',
  ACCESS_TOKEN_SECRET: 'placeholder-secret-for-openapi-export-only',
  REFRESH_TOKEN_SECRET: 'placeholder-secret-for-openapi-export-only',
};

async function exportOpenApi(): Promise<void> {
  for (const [key, value] of Object.entries(PLACEHOLDER_ENVIRONMENT)) {
    process.env[key] ??= value;
  }

  const { AppModule } = await import('../app.module.js');
  const { API_PREFIX } = await import('../common/constants/jwt.constants.js');
  const { createOpenApiDocument } = await import('../config/swagger.config.js');

  const app = await NestFactory.create(AppModule, {
    preview: true,
    logger: false,
  });
  app.setGlobalPrefix(API_PREFIX);

  const outputPath = join(__dirname, '../../openapi.json');
  writeFileSync(
    outputPath,
    `${JSON.stringify(createOpenApiDocument(app), null, 2)}\n`,
  );
  await app.close();
  console.log(`[openapi] wrote ${outputPath}`);
}

exportOpenApi().catch((error: unknown) => {
  console.error('[openapi] failed:', error);
  process.exitCode = 1;
});
