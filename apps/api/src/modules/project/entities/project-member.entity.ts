import { BaseEntity } from '@common/abstracts/base.entity';
import { Column, Entity, Index, Unique } from 'typeorm';

@Index('idx_members_project', ['projectId'])
@Index('idx_members_user', ['userId'])
@Unique('uq_members_project_user', ['projectId', 'userId'])
@Entity('project_members')
export class ProjectMember extends BaseEntity {
  @Column({ type: 'uuid' })
  projectId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  /** What the Member does on this Project, e.g. "Lead tester". */
  @Column({ type: 'varchar', nullable: true })
  roleInProject!: string | null;
}
