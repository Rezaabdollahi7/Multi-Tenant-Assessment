import { BaseEntity } from '@common/abstracts/base.entity';
import { Column, Entity, Index } from 'typeorm';
import { FindingSeverity } from '../enums/finding-severity.enum';
import { FindingStatus } from '../enums/finding-status.enum';

@Index('idx_findings_org_project', ['orgId', 'projectId'])
@Entity('findings')
export class Finding extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  projectId!: string;

  @Column({ type: 'uuid' })
  @Index()
  orgId!: string;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    type: 'enum',
    enum: FindingSeverity,
    default: FindingSeverity.INFO,
  })
  @Index()
  severity!: FindingSeverity;

  @Column({ type: 'enum', enum: FindingStatus, default: FindingStatus.OPEN })
  @Index()
  status!: FindingStatus;

  @Column({ type: 'uuid' })
  createdById!: string;
}
