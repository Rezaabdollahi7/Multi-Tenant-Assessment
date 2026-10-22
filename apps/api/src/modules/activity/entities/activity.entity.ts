import { BaseEntity } from '@common/abstracts/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';

@Index('idx_activities_org_created', ['orgId', 'createdAt'])
@Entity('activities')
export class Activity extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  @Index()
  orgId: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ApiProperty()
  @Column()
  action: string;

  @ApiProperty()
  @Column()
  targetType: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  targetId: string;

  @ApiProperty()
  @Column({ nullable: true })
  targetName: string;
}
