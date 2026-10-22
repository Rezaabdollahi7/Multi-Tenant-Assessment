import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SummaryUserDataDto {
  @ApiProperty({ example: 'Mahdi' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  fullName: string;
}
