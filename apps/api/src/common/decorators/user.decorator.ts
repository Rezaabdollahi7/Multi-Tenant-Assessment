import type { JwtPayload } from '@common/@types/jwt-payload.type';
import {
  createParamDecorator,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

export const UserInfo = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<Request>().user;
    if (!user) {
      throw new UnauthorizedException('Invalid or expired session');
    }
    return field ? user[field] : user;
  },
);
