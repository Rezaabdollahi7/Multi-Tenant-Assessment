import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { Project } from '../project/entities/project.entity';
import { Finding } from '../finding/entities/finding.entity';
import { Activity } from '../activity/entities/activity.entity';
import { User } from '../auth/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Finding, Activity, User])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
