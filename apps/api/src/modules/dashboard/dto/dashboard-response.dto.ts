import { ApiProperty } from '@nestjs/swagger';

export type SeverityKey = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type ProjectStatusKey =
  'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';

export class DashboardSummaryDto {
  @ApiProperty()
  projectsCount: number;

  @ApiProperty()
  findingsCount: number;

  @ApiProperty({ description: 'Findings grouped by severity' })
  severityBreakdown: Record<SeverityKey, number>;

  @ApiProperty({ description: 'Projects grouped by status' })
  projectStatusBreakdown: Record<ProjectStatusKey, number>;
}

export class TrendPointDto {
  @ApiProperty({ example: '2026-10-18' })
  date: string;

  @ApiProperty()
  count: number;
}

export class ActivityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  targetType: string;

  @ApiProperty()
  targetId: string;

  @ApiProperty()
  targetName: string | null;

  @ApiProperty()
  createdAt: Date;
}
