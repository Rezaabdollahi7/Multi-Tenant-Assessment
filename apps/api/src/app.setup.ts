import { API_PREFIX } from '@common/constants/jwt.constants';
import { AllExceptionsFilter } from '@common/filter/exception.filter';
import type { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { createValidationPipe } from './config/validation-pipe.config';

export function configureApp(app: INestApplication): void {
  app.use(helmet());
  app.use(cookieParser());
  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
}
