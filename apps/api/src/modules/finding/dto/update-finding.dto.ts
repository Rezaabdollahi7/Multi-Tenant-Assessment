import { FindingSeverity } from '../enums/finding-severity.enum';
import { FindingStatus } from '../enums/finding-status.enum';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateFindingDto {
  @ApiPropertyOptional({ minLength: 3, maxLength: 200 })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(3, { message: 'title must be at least 3 characters' })
  @MaxLength(200, { message: 'title must be at most 200 characters' })
  title?: string;

  @ApiPropertyOptional({ maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'description must be at most 5000 characters' })
  description?: string;

  @ApiPropertyOptional({ enum: FindingSeverity, enumName: 'FindingSeverity' })
  @IsOptional()
  @IsEnum(FindingSeverity)
  severity?: FindingSeverity;

  @ApiPropertyOptional({ enum: FindingStatus, enumName: 'FindingStatus' })
  @IsOptional()
  @IsEnum(FindingStatus)
  status?: FindingStatus;
}
