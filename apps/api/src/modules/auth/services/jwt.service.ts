import {
  JwtPayload,
  RefreshTokenPayload,
} from '@common/@types/jwt-payload.type';
import { REFRESH_TOKEN_TTL_SECONDS } from '@common/constants/jwt.constants';
import type { Environment } from 'src/config/env.validation';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Environment, true>,
  ) {}

  get accessTokenTtlSeconds(): number {
    return this.configService.get('ACCESS_TOKEN_TTL_SECONDS', { infer: true });
  }

  generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenTtlSeconds,
      secret: this.configService.get('ACCESS_TOKEN_SECRET', { infer: true }),
    });
  }

  generateRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: REFRESH_TOKEN_TTL_SECONDS,
      secret: this.configService.get('REFRESH_TOKEN_SECRET', { infer: true }),
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET', { infer: true }),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      return await this.jwtService.verifyAsync<RefreshTokenPayload>(token, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET', { infer: true }),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}
