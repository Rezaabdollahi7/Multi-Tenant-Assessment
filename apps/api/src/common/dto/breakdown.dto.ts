import { ApiProperty } from '@nestjs/swagger';
import { FindingSeverity } from '../../modules/finding/enums/finding-severity.enum';
import { ProjectStatus } from '../../modules/project/enums/project-status.enum';

/** Finding counts per Severity; every Severity is present, zero when absent. */
export class SeverityBreakdownDto implements Record<FindingSeverity, number> {
  @ApiProperty() CRITICAL!: number;
  @ApiProperty() HIGH!: number;
  @ApiProperty() MEDIUM!: number;
  @ApiProperty() LOW!: number;
  @ApiProperty() INFO!: number;
}

/** Project counts per Project Status; every status is present, zero when absent. */
export class ProjectStatusBreakdownDto implements Record<
  ProjectStatus,
  number
> {
  @ApiProperty() PLANNED!: number;
  @ApiProperty() IN_PROGRESS!: number;
  @ApiProperty() COMPLETED!: number;
  @ApiProperty() ARCHIVED!: number;
}

export function countBy<K extends string>(
  keys: readonly K[],
  rows: { key: string; count: string }[],
): Record<K, number> {
  const counts = Object.fromEntries(keys.map((key) => [key, 0])) as Record<
    K,
    number
  >;
  for (const row of rows) {
    if ((keys as readonly string[]).includes(row.key)) {
      counts[row.key as K] = Number(row.count);
    }
  }
  return counts;
}
