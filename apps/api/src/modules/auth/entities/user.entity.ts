import { BaseEntity } from '@common/abstracts/base.entity';
import { Roles } from '@common/enums/role-app.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';

@Entity('users')
@Index('idx_users_org', ['orgId'])
export class User extends BaseEntity {
  @ApiPropertyOptional()
  @Column({ nullable: true })
  name: string;

  @ApiProperty({ enum: Roles })
  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.VIEWER,
  })
  role: Roles;

  @ApiProperty()
  @Column({ unique: true })
  phone: string;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: true })
  orgId: string;
}
