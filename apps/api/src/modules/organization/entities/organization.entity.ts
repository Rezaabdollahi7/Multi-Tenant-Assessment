import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@common/abstracts/base.entity';

@Entity('organizations')
export class Organization extends BaseEntity {
  @ApiProperty()
  @Column({ unique: true })
  name: string;
}
