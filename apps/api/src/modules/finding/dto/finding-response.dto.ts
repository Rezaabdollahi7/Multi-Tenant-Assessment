import { FindingSeverity } from '../enums/finding-severity.enum';
import { FindingStatus } from '../enums/finding-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: FindingSeverity })
  severity: FindingSeverity;

  @ApiProperty({ enum: FindingStatus })
  status: FindingStatus;

  @ApiProperty()
  createdById: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
