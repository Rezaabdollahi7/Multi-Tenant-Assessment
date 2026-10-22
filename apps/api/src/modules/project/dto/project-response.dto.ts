import { PaginationMetaDto } from '@common/dto/pagination.dto';
import { SeverityBreakdownDto } from '@common/dto/breakdown.dto';
import { Roles } from '@common/enums/role-app.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../enums/project-status.enum';

export class ProjectDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: String, nullable: true })
  description!: string | null;

  @ApiProperty({ enum: ProjectStatus, enumName: 'ProjectStatus' })
  status!: ProjectStatus;

  @ApiProperty({ minimum: 0 })
  findingsCount!: number;

  @ApiProperty({ minimum: 0 })
  membersCount!: number;

  @ApiProperty()
  createdAt!: Date;
}

export class ProjectDetailDto extends ProjectDto {
  @ApiProperty({ type: SeverityBreakdownDto })
  severityBreakdown!: SeverityBreakdownDto;
}

export class ProjectListDto {
  @ApiProperty({ type: [ProjectDto] })
  data!: ProjectDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}

export class MemberDto {
  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty({ type: String, nullable: true })
  name!: string | null;

  @ApiProperty({ enum: Roles, enumName: 'Role' })
  role!: Roles;

  @ApiProperty({ type: String, nullable: true })
  roleInProject!: string | null;

  @ApiProperty()
  joinedAt!: Date;
}
