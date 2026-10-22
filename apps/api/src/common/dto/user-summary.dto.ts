import { ApiProperty } from '@nestjs/swagger';

/** Who did something, without contact details. */
export class UserSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ type: String, nullable: true })
  name!: string | null;
}
