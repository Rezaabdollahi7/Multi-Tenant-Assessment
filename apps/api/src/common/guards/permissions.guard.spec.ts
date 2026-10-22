import type { JwtPayload } from '@common/@types/jwt-payload.type';
import type { Permission } from '@common/constants/permissions.constants';
import { PERMISSIONS_KEY } from '@common/constants/permissions.constants';
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';
import { Roles } from '@common/enums/role-app.enum';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';

function makeReflector(overrides: {
  isPublic?: boolean;
  permissions?: Permission[];
}): Reflector {
  const getAllAndOverride = (key: string | symbol) => {
    if (key === IS_PUBLIC_KEY) return overrides.isPublic ?? false;
    if (key === PERMISSIONS_KEY) return overrides.permissions ?? undefined;
    return undefined;
  };
  return { getAllAndOverride } as unknown as Reflector;
}

function makeContext(user?: JwtPayload): ExecutionContext {
  return {
    getHandler: () => ({ name: 'handler' }),
    getClass: () => Object,
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

const viewer: JwtPayload = {
  sub: 'user-1',
  role: Roles.VIEWER,
  orgId: 'org-1',
};

const admin: JwtPayload = {
  sub: 'user-2',
  role: Roles.ADMIN,
  orgId: 'org-1',
};

describe('PermissionsGuard', () => {
  it('allows @Public routes without a user', () => {
    const guard = new PermissionsGuard(makeReflector({ isPublic: true }));
    expect(guard.canActivate(makeContext())).toBe(true);
  });

  it('allows routes without permission metadata', () => {
    const guard = new PermissionsGuard(
      makeReflector({ permissions: undefined }),
    );
    expect(guard.canActivate(makeContext(admin))).toBe(true);
  });

  it('allows when the user has all required permissions', () => {
    const guard = new PermissionsGuard(
      makeReflector({ permissions: ['finding:delete'] }),
    );
    expect(guard.canActivate(makeContext(admin))).toBe(true);
  });

  it('denies when the user lacks a required permission', () => {
    const guard = new PermissionsGuard(
      makeReflector({ permissions: ['finding:create'] }),
    );
    expect(() => guard.canActivate(makeContext(viewer))).toThrow(
      ForbiddenException,
    );
  });

  it('requires ALL listed permissions (denies on any missing)', () => {
    const guard = new PermissionsGuard(
      makeReflector({ permissions: ['finding:read', 'finding:delete'] }),
    );
    // Analyst has finding:read but not finding:delete
    const analyst: JwtPayload = {
      sub: 'user-3',
      role: Roles.ANALYST,
      orgId: 'org-1',
    };
    expect(() => guard.canActivate(makeContext(analyst))).toThrow(
      ForbiddenException,
    );
  });

  it('denies when no user is present on a protected route', () => {
    const guard = new PermissionsGuard(
      makeReflector({ permissions: ['finding:read'] }),
    );
    expect(() => guard.canActivate(makeContext())).toThrow(ForbiddenException);
  });
});
