import { RequirePermissions } from '@common/decorators/permissions.decorator';
import { UserInfo } from '@common/decorators/user.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivitiesQueryDto } from '../dto/activities-query.dto';
import {
  ActivityDto,
  DashboardSummaryDto,
  TrendPointDto,
} from '../dto/dashboard-response.dto';
import { TrendQueryDto } from '../dto/trend-query.dto';
import { DashboardService } from '../services/dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @RequirePermissions('dashboard:read')
  @ApiOperation({ summary: 'Counts and breakdowns for the Organization' })
  @ApiOkResponse({ type: DashboardSummaryDto })
  summary(@UserInfo('orgId') orgId: string): Promise<DashboardSummaryDto> {
    return this.dashboardService.summary(orgId);
  }

  @Get('trend')
  @RequirePermissions('dashboard:read')
  @ApiOperation({ summary: 'Findings created per day, by Severity' })
  @ApiOkResponse({ type: [TrendPointDto] })
  trend(
    @UserInfo('orgId') orgId: string,
    @Query() query: TrendQueryDto,
  ): Promise<TrendPointDto[]> {
    return this.dashboardService.trend(orgId, query.days);
  }

  @Get('activities')
  @RequirePermissions('activity:read')
  @ApiOperation({ summary: 'Latest Activities in the Organization' })
  @ApiOkResponse({ type: [ActivityDto] })
  activities(
    @UserInfo('orgId') orgId: string,
    @Query() query: ActivitiesQueryDto,
  ): Promise<ActivityDto[]> {
    return this.dashboardService.activities(orgId, query.limit);
  }
}
