import type { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  type OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';

export function createOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Secure Multi-Tenant Assessment Dashboard API')
    .setDescription(
      'Sign in with POST /api/auth/request-otp then /api/auth/verify-otp; the session lives in httpOnly cookies.',
    )
    .setVersion('1.0.0')
    .addCookieAuth('X-ACCESS')
    .build();
  return SwaggerModule.createDocument(app, config);
}

export function initSwagger(app: INestApplication): void {
  SwaggerModule.setup('/docs', app, createOpenApiDocument(app), {
    customSiteTitle: 'Assessment API',
    swaggerOptions: { persistAuthorization: true, filter: true },
  });
}
