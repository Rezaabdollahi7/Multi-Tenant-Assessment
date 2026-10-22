import { Roles } from '@common/enums/role-app.enum';

export const PERMISSIONS = [
  'dashboard:read',
  'project:read',
  'member:read',
  'finding:read',
  'finding:create',
  'finding:update',
  'finding:delete',
  'activity:read',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const VIEWER_PERMISSIONS: Permission[] = [
  'dashboard:read',
  'project:read',
  'member:read',
  'finding:read',
  'activity:read',
];

const ANALYST_PERMISSIONS: Permission[] = [
  ...VIEWER_PERMISSIONS,
  'finding:create',
  'finding:update',
];

const ADMIN_PERMISSIONS: Permission[] = [
  ...ANALYST_PERMISSIONS,
  'finding:delete',
];

export const ROLE_PERMISSIONS: Record<Roles, readonly Permission[]> = {
  [Roles.ADMIN]: ADMIN_PERMISSIONS,
  [Roles.ANALYST]: ANALYST_PERMISSIONS,
  [Roles.VIEWER]: VIEWER_PERMISSIONS,
};

export const PERMISSIONS_KEY = Symbol('PERMISSIONS');
