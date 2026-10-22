import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { FindingSeverity } from '../enums/finding-severity.enum';

export class CreateFindingDto {
  @ApiProperty({ minLength: 3, maxLength: 200 })
  @IsString()
  @MinLength(3, { message: 'title must be at least 3 characters' })
  @MaxLength(200, { message: 'title must be at most 200 characters' })
  title: string;

  @ApiPropertyOptional({ maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'description must be at most 5000 characters' })
  description?: string;

  @ApiProperty({ enum: FindingSeverity })
  @IsEnum(FindingSeverity, { message: 'severity must be a valid value' })
  severity: FindingSeverity;

  @ApiProperty({ format: 'uuid' })
  @IsUUID(undefined, { message: 'projectId must be a valid UUID' })
  projectId: string;
}
