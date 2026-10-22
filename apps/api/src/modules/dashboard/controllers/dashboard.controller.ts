import { TrendQueryDto } from '../dto/trend-query.dto';
import { ActivitiesQueryDto } from '../dto/activities-query.dto';
import { DashboardSummaryDto } from '../dto/dashboard-response.dto';
import { DashboardService } from '../services/dashboard.service';
import { RequirePermissions } from '@common/decorators/permissions.decorator';
import { UserInfo } from '@common/decorators/user.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @RequirePermissions('dashboard:read')
  @ApiOperation({ summary: 'Dashboard summary counts and breakdowns' })
  @ApiResponse({ status: 200, type: DashboardSummaryDto })
  summary(@UserInfo('orgId') orgId: string) {
    return this.dashboardService.summary(orgId);
  }

  @Get('trend')
  @RequirePermissions('dashboard:read')
  @ApiOperation({ summary: 'Findings created per day over a time window' })
  @ApiResponse({ status: 200, description: 'Array of { date, count }' })
  trend(@UserInfo('orgId') orgId: string, @Query() query: TrendQueryDto) {
    return this.dashboardService.trend(orgId, query.days);
  }

  @Get('activities')
  @RequirePermissions('activity:read')
  @ApiOperation({ summary: 'Latest activities in the organization' })
  @ApiResponse({ status: 200, description: 'Array of activities' })
  activities(
    @UserInfo('orgId') orgId: string,
    @Query() query: ActivitiesQueryDto,
  ) {
    return this.dashboardService.activities(orgId, query.limit);
  }
}
