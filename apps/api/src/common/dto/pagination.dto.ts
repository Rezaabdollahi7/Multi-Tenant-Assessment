import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ minimum: 1 })
  page!: number;

  @ApiProperty({ minimum: 1 })
  limit!: number;

  @ApiProperty({ minimum: 0 })
  totalItems!: number;

  @ApiProperty({ minimum: 0 })
  totalPages!: number;
}

export function paginationMeta(
  page: number,
  limit: number,
  totalItems: number,
): PaginationMetaDto {
  return { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) };
}
