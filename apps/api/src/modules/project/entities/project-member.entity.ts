import { BaseEntity } from '@common/abstracts/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, Index } from 'typeorm';

@Index('idx_members_project', ['projectId'])
@Index('idx_members_user', ['userId'])
@Entity('project_members')
export class ProjectMember extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  projectId: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty()
  @Column({ nullable: true })
  roleInProject: string;

  @ApiProperty()
  @CreateDateColumn()
  joinedAt: Date;
}
