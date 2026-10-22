import { AuthorizationModule } from '@common/modules/authorization.module';
import { AppCacheModule } from '@common/modules/cache.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnvironment } from './config/env.validation';
import { TypeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ActivityModule } from './modules/activity/activity.module';
import { ProjectModule } from './modules/project/project.module';
import { FindingModule } from './modules/finding/finding.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    AuthorizationModule,
    AppCacheModule,
    AuthModule,
    OrganizationModule,
    ActivityModule,
    ProjectModule,
    FindingModule,
    DashboardModule,
  ],
})
export class AppModule {}
