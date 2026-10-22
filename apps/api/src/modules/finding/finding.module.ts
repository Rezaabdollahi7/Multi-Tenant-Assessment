import { FindingsController } from './controllers/findings.controller';
import { Finding } from './entities/finding.entity';
import { FindingsService } from './services/findings.service';
import { Project } from '../project/entities/project.entity';
import { ActivityModule } from '../activity/activity.module';
import { User } from '../auth/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Finding, Project, User]), ActivityModule],
  controllers: [FindingsController],
  providers: [FindingsService],
})
export class FindingModule {}
