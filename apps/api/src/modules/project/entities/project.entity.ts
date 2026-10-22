import { BaseEntity } from '@common/abstracts/base.entity';
import { Column, Entity, Index } from 'typeorm';
import { ProjectStatus } from '../enums/project-status.enum';

@Index('idx_projects_org_status', ['orgId', 'status'])
@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  orgId!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PLANNED })
  status!: ProjectStatus;
}
