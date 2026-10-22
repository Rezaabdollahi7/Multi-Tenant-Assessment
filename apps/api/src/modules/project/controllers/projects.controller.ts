import { RequirePermissions } from '@common/decorators/permissions.decorator';
import { UserInfo } from '@common/decorators/user.decorator';
import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ListProjectsQueryDto } from '../dto/list-projects-query.dto';
import {
  MemberDto,
  ProjectDetailDto,
  ProjectListDto,
} from '../dto/project-response.dto';
import { ProjectsService } from '../services/projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @RequirePermissions('project:read')
  @ApiOperation({ summary: "List the Organization's Projects" })
  @ApiOkResponse({ type: ProjectListDto })
  list(
    @UserInfo('orgId') orgId: string,
    @Query() query: ListProjectsQueryDto,
  ): Promise<ProjectListDto> {
    return this.projectsService.list(orgId, query);
  }

  @Get(':id')
  @RequirePermissions('project:read')
  @ApiOperation({ summary: 'A Project with its Finding counts by Severity' })
  @ApiOkResponse({ type: ProjectDetailDto })
  @ApiNotFoundResponse({ description: 'Not found in this Organization' })
  detail(
    @UserInfo('orgId') orgId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProjectDetailDto> {
    return this.projectsService.detail(orgId, id);
  }

  @Get(':id/members')
  @RequirePermissions('project:read', 'member:read')
  @ApiOperation({ summary: "A Project's Members" })
  @ApiOkResponse({ type: [MemberDto] })
  @ApiNotFoundResponse({ description: 'Not found in this Organization' })
  members(
    @UserInfo('orgId') orgId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MemberDto[]> {
    return this.projectsService.members(orgId, id);
  }
}
