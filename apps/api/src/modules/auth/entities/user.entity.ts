import { BaseEntity } from '@common/abstracts/base.entity';
import { Roles } from '@common/enums/role-app.enum';
import { Column, Entity, Index } from 'typeorm';

@Entity('users')
@Index('idx_users_org', ['orgId'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  name!: string | null;

  @Column({ type: 'enum', enum: Roles, default: Roles.VIEWER })
  role!: Roles;

  @Column({ unique: true })
  phone!: string;

  @Column({ type: 'uuid' })
  orgId!: string;
}
