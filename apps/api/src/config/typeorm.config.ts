import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import type { Environment } from './env.validation';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService<Environment, true>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get('POSTGRES_HOST', { infer: true }),
      port: this.config.get('POSTGRES_PORT', { infer: true }),
      username: this.config.get('POSTGRES_USER', { infer: true }),
      password: this.config.get('POSTGRES_PASSWORD', { infer: true }),
      database: this.config.get('POSTGRES_DB', { infer: true }),
      autoLoadEntities: true,
      // Schema is derived from the entities; see docs/limitations.md.
      synchronize: true,
    };
  }
}
