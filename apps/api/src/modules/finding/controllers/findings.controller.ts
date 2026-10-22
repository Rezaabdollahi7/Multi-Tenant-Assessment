import { ListFindingsQueryDto } from '../dto/list-findings-query.dto';
import { CreateFindingDto } from '../dto/create-finding.dto';
import { UpdateFindingDto } from '../dto/update-finding.dto';
import { FindingDto } from '../dto/finding-response.dto';
import { FindingsService } from '../services/findings.service';
import { RequirePermissions } from '@common/decorators/permissions.decorator';
import { UserInfo } from '@common/decorators/user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('findings')
@Controller('findings')
export class FindingsController {
  constructor(private readonly findingsService: FindingsService) {}

  @Get()
  @RequirePermissions('finding:read')
  @ApiOperation({ summary: 'List findings in the current organization' })
  @ApiResponse({ status: 200, description: 'Paginated findings' })
  list(@UserInfo('orgId') orgId: string, @Query() query: ListFindingsQueryDto) {
    return this.findingsService.list(orgId, query);
  }

  @Get(':id')
  @RequirePermissions('finding:read')
  @ApiOperation({ summary: 'Get a single finding' })
  @ApiResponse({ status: 200, type: FindingDto })
  @ApiResponse({ status: 404, description: 'Finding not found' })
  detail(
    @UserInfo('orgId') orgId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.findingsService.detail(orgId, id);
  }

  @Post()
  @RequirePermissions('finding:create')
  @ApiOperation({ summary: 'Create a finding' })
  @ApiResponse({ status: 201, type: FindingDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  create(
    @UserInfo('orgId') orgId: string,
    @UserInfo('sub') userId: string,
    @Body() dto: CreateFindingDto,
  ) {
    return this.findingsService.create(orgId, userId, dto);
  }

  @Patch(':id')
  @RequirePermissions('finding:update')
  @ApiOperation({ summary: 'Update a finding' })
  @ApiResponse({ status: 200, type: FindingDto })
  @ApiResponse({ status: 404, description: 'Finding not found' })
  update(
    @UserInfo('orgId') orgId: string,
    @UserInfo('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFindingDto,
  ) {
    return this.findingsService.update(orgId, userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('finding:delete')
  @ApiOperation({ summary: 'Delete a finding' })
  @ApiResponse({ status: 200, description: 'Finding deleted' })
  @ApiResponse({ status: 404, description: 'Finding not found' })
  remove(
    @UserInfo('orgId') orgId: string,
    @UserInfo('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.findingsService.remove(orgId, userId, id);
  }
}
