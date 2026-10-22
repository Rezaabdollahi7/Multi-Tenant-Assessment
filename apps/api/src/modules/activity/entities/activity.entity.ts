import { BaseEntity } from '@common/abstracts/base.entity';
import { Column, Entity, Index } from 'typeorm';
import type {
  ActivityAction,
  ActivityTargetType,
} from '../constants/activity.constants';

@Index('idx_activities_org_created', ['orgId', 'createdAt'])
@Entity('activities')
export class Activity extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  orgId!: string;

  @Column({ type: 'uuid' })
  @Index()
  userId!: string;

  @Column({ type: 'varchar' })
  action!: ActivityAction;

  @Column({ type: 'varchar' })
  targetType!: ActivityTargetType;

  @Column({ type: 'uuid' })
  targetId!: string;

  /** The target's name at the time, so deleted targets still read well. */
  @Column({ type: 'varchar' })
  targetName!: string;
}
