import { PaginationMetaDto } from '@common/dto/pagination.dto';
import { UserSummaryDto } from '@common/dto/user-summary.dto';
import { ApiProperty } from '@nestjs/swagger';
import { FindingSeverity } from '../enums/finding-severity.enum';
import { FindingStatus } from '../enums/finding-status.enum';

export class ProjectSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;
}

export class FindingDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: String, nullable: true })
  description!: string | null;

  @ApiProperty({ enum: FindingSeverity, enumName: 'FindingSeverity' })
  severity!: FindingSeverity;

  @ApiProperty({ enum: FindingStatus, enumName: 'FindingStatus' })
  status!: FindingStatus;

  @ApiProperty({ type: ProjectSummaryDto })
  project!: ProjectSummaryDto;

  @ApiProperty({ type: UserSummaryDto })
  createdBy!: UserSummaryDto;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class FindingListDto {
  @ApiProperty({ type: [FindingDto] })
  data!: FindingDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
