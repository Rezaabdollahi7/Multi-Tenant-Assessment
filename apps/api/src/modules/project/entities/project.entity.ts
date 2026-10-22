import { BaseEntity } from '@common/abstracts/base.entity';
import { ProjectStatus } from '../enums/project-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';

@Index('idx_projects_org_status', ['orgId', 'status'])
@Entity('projects')
export class Project extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  @Index()
  orgId: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ enum: ProjectStatus })
  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.ACTIVE })
  status: ProjectStatus;
}
