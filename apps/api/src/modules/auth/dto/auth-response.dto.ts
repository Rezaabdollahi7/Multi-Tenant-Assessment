import {
  PERMISSIONS,
  type Permission,
} from '@common/constants/permissions.constants';
import { Roles } from '@common/enums/role-app.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestOtpResponseDto {
  @ApiProperty({ example: 'Verification code sent' })
  message!: string;

  @ApiProperty({ description: 'Wrong attempts left before a temporary lock' })
  remainingAttempts!: number;

  @ApiPropertyOptional({
    description: 'Returned only outside production, so demos need no SMS',
    example: '00000',
  })
  code?: string;
}

export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success!: true;
}

export class OrganizationSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;
}

export class CurrentUserDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ type: String, nullable: true })
  name!: string | null;

  @ApiProperty()
  phone!: string;

  @ApiProperty({ enum: Roles, enumName: 'Role' })
  role!: Roles;

  @ApiProperty({ type: OrganizationSummaryDto })
  organization!: OrganizationSummaryDto;

  @ApiProperty({ enum: PERMISSIONS, enumName: 'Permission', isArray: true })
  permissions!: Permission[];
}
