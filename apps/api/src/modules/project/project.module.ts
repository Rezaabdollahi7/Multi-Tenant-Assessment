import { ProjectsController } from './controllers/projects.controller';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectsService } from './services/projects.service';
import { Finding } from '../finding/entities/finding.entity';
import { User } from '../auth/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectMember, Finding, User])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectModule {}
