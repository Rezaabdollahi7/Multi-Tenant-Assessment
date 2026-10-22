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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFindingDto } from '../dto/create-finding.dto';
import { FindingDto, FindingListDto } from '../dto/finding-response.dto';
import { ListFindingsQueryDto } from '../dto/list-findings-query.dto';
import { UpdateFindingDto } from '../dto/update-finding.dto';
import { FindingsService } from '../services/findings.service';

@ApiTags('findings')
@ApiForbiddenResponse({ description: 'Missing the required Permission' })
@Controller('findings')
export class FindingsController {
  constructor(private readonly findingsService: FindingsService) {}

  @Get()
  @RequirePermissions('finding:read')
  @ApiOperation({ summary: "List the Organization's Findings" })
  @ApiOkResponse({ type: FindingListDto })
  list(
    @UserInfo('orgId') orgId: string,
    @Query() query: ListFindingsQueryDto,
  ): Promise<FindingListDto> {
    return this.findingsService.list(orgId, query);
  }

  @Get(':id')
  @RequirePermissions('finding:read')
  @ApiOperation({ summary: 'A single Finding' })
  @ApiOkResponse({ type: FindingDto })
  @ApiNotFoundResponse({ description: 'Not found in this Organization' })
  detail(
    @UserInfo('orgId') orgId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FindingDto> {
    return this.findingsService.detail(orgId, id);
  }

  @Post()
  @RequirePermissions('finding:create')
  @ApiOperation({ summary: 'Record a Finding' })
  @ApiCreatedResponse({ type: FindingDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiNotFoundResponse({
    description: 'Project not found in this Organization',
  })
  create(
    @UserInfo('orgId') orgId: string,
    @UserInfo('sub') userId: string,
    @Body() dto: CreateFindingDto,
  ): Promise<FindingDto> {
    return this.findingsService.create(orgId, userId, dto);
  }

  @Patch(':id')
  @RequirePermissions('finding:update')
  @ApiOperation({ summary: 'Edit a Finding' })
  @ApiOkResponse({ type: FindingDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiNotFoundResponse({ description: 'Not found in this Organization' })
  update(
    @UserInfo('orgId') orgId: string,
    @UserInfo('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFindingDto,
  ): Promise<FindingDto> {
    return this.findingsService.update(orgId, userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions('finding:delete')
  @ApiOperation({ summary: 'Delete a Finding' })
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiNotFoundResponse({ description: 'Not found in this Organization' })
  remove(
    @UserInfo('orgId') orgId: string,
    @UserInfo('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.findingsService.remove(orgId, userId, id);
  }
}
