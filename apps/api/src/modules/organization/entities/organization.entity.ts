import { BaseEntity } from '@common/abstracts/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('organizations')
export class Organization extends BaseEntity {
  @Column({ unique: true })
  name!: string;
}
