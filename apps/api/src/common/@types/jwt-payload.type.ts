import type { Roles } from '@common/enums/role-app.enum';

export type JwtPayload = {
  sub: string;
  role: Roles;
  orgId: string;
};

export type RefreshTokenPayload = JwtPayload & {
  familyId: string;
  jti: string;
};
