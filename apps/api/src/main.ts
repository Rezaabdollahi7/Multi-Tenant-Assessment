import { API_PREFIX } from '@common/constants/jwt.constants';
import { AllExceptionsFilter } from '@common/filter/exception.filter';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import type { Environment } from 'src/config/env.validation';
import { initSwagger } from 'src/config/swagger.config';
import { createValidationPipe } from 'src/config/validation-pipe.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<ConfigService<Environment, true>>(ConfigService);

  app.use(helmet());
  app.use(cookieParser());
  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  // The web app proxies /api to us, so browsers never call cross-origin.
  // CORS_ORIGIN only opens the API to other origins when explicitly set.
  const corsOrigin = config.get('CORS_ORIGIN', { infer: true });
  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',') : false,
    credentials: true,
  });

  initSwagger(app);

  await app.listen(config.get('PORT', { infer: true }));
}

void bootstrap();
