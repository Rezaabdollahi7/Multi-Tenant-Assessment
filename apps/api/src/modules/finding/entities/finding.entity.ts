import { BaseEntity } from '@common/abstracts/base.entity';
import { FindingSeverity } from '../enums/finding-severity.enum';
import { FindingStatus } from '../enums/finding-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';

@Index('idx_findings_org_project', ['orgId', 'projectId'])
@Entity('findings')
export class Finding extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  @Index()
  projectId: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  @Index()
  orgId: string;

  @ApiProperty()
  @Column({ length: 200 })
  title: string;

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ enum: FindingSeverity })
  @Column({
    type: 'enum',
    enum: FindingSeverity,
    default: FindingSeverity.INFO,
  })
  @Index()
  severity: FindingSeverity;

  @ApiProperty({ enum: FindingStatus })
  @Column({ type: 'enum', enum: FindingStatus, default: FindingStatus.OPEN })
  @Index()
  status: FindingStatus;

  @ApiProperty()
  @Column({ type: 'uuid' })
  createdById: string;
}
