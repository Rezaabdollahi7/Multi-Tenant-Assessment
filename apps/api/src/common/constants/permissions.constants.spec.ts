import { ROLE_PERMISSIONS, type Permission } from './permissions.constants';
import { Roles } from '@common/enums/role-app.enum';

describe('ROLE_PERMISSIONS', () => {
  it('VIEWER has only read permissions', () => {
    const perms = ROLE_PERMISSIONS[Roles.VIEWER];
    expect(perms).toEqual([
      'dashboard:read',
      'project:read',
      'member:read',
      'finding:read',
      'activity:read',
    ]);
    expect(perms).not.toContain('finding:create');
    expect(perms).not.toContain('finding:update');
    expect(perms).not.toContain('finding:delete');
    expect(perms).not.toContain('member:manage');
  });

  it('ANALYST inherits VIEWER and adds create/update', () => {
    const perms = ROLE_PERMISSIONS[Roles.ANALYST];
    for (const p of ROLE_PERMISSIONS[Roles.VIEWER]) {
      expect(perms).toContain(p);
    }
    expect(perms).toContain('finding:create');
    expect(perms).toContain('finding:update');
    expect(perms).not.toContain('finding:delete');
    expect(perms).not.toContain('member:manage');
  });

  it('ADMIN inherits ANALYST and adds manage/delete', () => {
    const perms = ROLE_PERMISSIONS[Roles.ADMIN];
    for (const p of ROLE_PERMISSIONS[Roles.ANALYST]) {
      expect(perms).toContain(p);
    }
    expect(perms).toContain('finding:delete');
    expect(perms).toContain('member:manage');
  });

  it('covers exactly the expected permission set', () => {
    const all: Permission[] = [
      'dashboard:read',
      'project:read',
      'member:read',
      'member:manage',
      'finding:read',
      'finding:create',
      'finding:update',
      'finding:delete',
      'activity:read',
    ];
    const adminPerms = ROLE_PERMISSIONS[Roles.ADMIN];
    expect(adminPerms.length).toBe(all.length);
    for (const p of all) {
      expect(adminPerms).toContain(p);
    }
  });
});
