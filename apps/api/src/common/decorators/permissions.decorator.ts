import type { Permission } from '@common/constants/permissions.constants';
import { PERMISSIONS_KEY } from '@common/constants/permissions.constants';
import { SetMetadata } from '@nestjs/common';

export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
