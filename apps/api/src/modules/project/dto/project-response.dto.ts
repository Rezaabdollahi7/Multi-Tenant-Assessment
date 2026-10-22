import { ProjectStatus } from '../enums/project-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty()
  createdAt: Date;
}

export class ProjectDetailDto extends ProjectDto {
  @ApiProperty()
  findingsCount: number;

  @ApiProperty({
    description: 'Number of findings grouped by severity',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  severityBreakdown: Record<string, number>;
}
