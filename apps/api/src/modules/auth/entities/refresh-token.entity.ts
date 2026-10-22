import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('refresh_tokens')
@Index('idx_refresh_tokens_family', ['familyId'])
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  familyId: string;

  @ApiProperty()
  @Column({ unique: true })
  tokenHash: string;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date | null;

  @ApiProperty()
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
