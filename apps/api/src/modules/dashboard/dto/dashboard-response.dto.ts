import {
  ProjectStatusBreakdownDto,
  SeverityBreakdownDto,
} from '@common/dto/breakdown.dto';
import { UserSummaryDto } from '@common/dto/user-summary.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  ACTIVITY_ACTIONS,
  ACTIVITY_TARGET_TYPES,
  type ActivityAction,
  type ActivityTargetType,
} from '../../activity/constants/activity.constants';

export class DashboardSummaryDto {
  @ApiProperty({ minimum: 0 })
  projectsCount!: number;

  @ApiProperty({ minimum: 0 })
  findingsCount!: number;

  @ApiProperty({ type: SeverityBreakdownDto })
  severityBreakdown!: SeverityBreakdownDto;

  @ApiProperty({ type: ProjectStatusBreakdownDto })
  projectStatusBreakdown!: ProjectStatusBreakdownDto;
}

export class TrendPointDto {
  @ApiProperty({ example: '2026-10-18', description: 'UTC calendar day' })
  date!: string;

  @ApiProperty({ minimum: 0 })
  total!: number;

  @ApiProperty({ type: SeverityBreakdownDto })
  bySeverity!: SeverityBreakdownDto;
}

export class ActivityTargetDto {
  @ApiProperty({ enum: ACTIVITY_TARGET_TYPES, enumName: 'ActivityTargetType' })
  type!: ActivityTargetType;

  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;
}

export class ActivityDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ enum: ACTIVITY_ACTIONS, enumName: 'ActivityAction' })
  action!: ActivityAction;

  @ApiProperty({ type: UserSummaryDto })
  actor!: UserSummaryDto;

  @ApiProperty({ type: ActivityTargetDto })
  target!: ActivityTargetDto;

  @ApiProperty()
  createdAt!: Date;
}
