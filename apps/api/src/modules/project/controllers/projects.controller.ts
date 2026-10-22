import { ListProjectsQueryDto } from '../dto/list-projects-query.dto';
import { ProjectDetailDto, ProjectDto } from '../dto/project-response.dto';
import { ProjectsService } from '../services/projects.service';
import { RequirePermissions } from '@common/decorators/permissions.decorator';
import { UserInfo } from '@common/decorators/user.decorator';
import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
@RequirePermissions('project:read')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List projects in the current organization' })
  @ApiResponse({
    status: 200,
    description: 'Paginated projects',
    type: ProjectDto,
  })
  list(@UserInfo('orgId') orgId: string, @Query() query: ListProjectsQueryDto) {
    return this.projectsService.list(orgId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details with finding counters' })
  @ApiResponse({ status: 200, type: ProjectDetailDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  detail(
    @UserInfo('orgId') orgId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectsService.detail(orgId, id);
  }

  @Get(':id/members')
  @RequirePermissions('member:read')
  @ApiOperation({ summary: 'List project members' })
  @ApiResponse({ status: 200, description: 'Members of the project' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  members(
    @UserInfo('orgId') orgId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectsService.members(orgId, id);
  }
}
