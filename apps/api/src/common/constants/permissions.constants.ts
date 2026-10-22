import { Roles } from '@common/enums/role-app.enum';

export type Permission =
  | 'dashboard:read'
  | 'project:read'
  | 'member:read'
  | 'member:manage'
  | 'finding:read'
  | 'finding:create'
  | 'finding:update'
  | 'finding:delete'
  | 'activity:read';

const VIEWER_PERMS: Permission[] = [
  'dashboard:read',
  'project:read',
  'member:read',
  'finding:read',
  'activity:read',
];

const ANALYST_PERMS: Permission[] = [
  ...VIEWER_PERMS,
  'finding:create',
  'finding:update',
];

const ADMIN_PERMS: Permission[] = [
  ...ANALYST_PERMS,
  'member:manage',
  'finding:delete',
];

export const ROLE_PERMISSIONS: Record<Roles, Permission[]> = {
  [Roles.ADMIN]: ADMIN_PERMS,
  [Roles.ANALYST]: ANALYST_PERMS,
  [Roles.VIEWER]: VIEWER_PERMS,
};

export const PERMISSIONS_KEY = Symbol('PERMISSIONS');
