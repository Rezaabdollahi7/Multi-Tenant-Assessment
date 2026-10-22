import { JwtAuthService } from '@auth/services/jwt.service';
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';
import { extractToken } from '@common/utils/extract-token';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class AuthWithHeader implements CanActivate {
  private readonly logger = new Logger(AuthWithHeader.name);

  constructor(
    private readonly jwtService: JwtAuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const token = extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    try {
      const payload = await this.jwtService.verifyAccessToken(token);
      request.user = payload;
      return true;
    } catch {
      this.logger.warn('Failed to verify access token');
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}
