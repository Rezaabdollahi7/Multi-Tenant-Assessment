import { PERMISSIONS, ROLE_PERMISSIONS } from './permissions.constants';
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
  });

  it('ANALYST inherits VIEWER and adds create/update', () => {
    const perms = ROLE_PERMISSIONS[Roles.ANALYST];
    for (const p of ROLE_PERMISSIONS[Roles.VIEWER]) {
      expect(perms).toContain(p);
    }
    expect(perms).toContain('finding:create');
    expect(perms).toContain('finding:update');
    expect(perms).not.toContain('finding:delete');
  });

  it('ADMIN inherits ANALYST and adds delete', () => {
    const perms = ROLE_PERMISSIONS[Roles.ADMIN];
    for (const p of ROLE_PERMISSIONS[Roles.ANALYST]) {
      expect(perms).toContain(p);
    }
    expect(perms).toContain('finding:delete');
  });

  it('gives ADMIN every Permission', () => {
    expect([...ROLE_PERMISSIONS[Roles.ADMIN]].sort()).toEqual(
      [...PERMISSIONS].sort(),
    );
  });
});
