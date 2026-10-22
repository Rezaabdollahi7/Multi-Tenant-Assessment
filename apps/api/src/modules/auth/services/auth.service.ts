import { RequestOtpDto } from '@auth/dto/req-otp.dto';
import { VrifyOtpDto } from '@auth/dto/vrify-otp.dto';
import { RefreshToken } from '@auth/entities/refresh-token.entity';
import { User } from '@auth/entities/user.entity';
import { JwtAuthService } from '@auth/services/jwt.service';
import {
  JwtPayload,
  RefreshTokenPayload,
} from '@common/@types/jwt-payload.type';
import { ROLE_PERMISSIONS } from '@common/constants/permissions.constants';
import { CacheService } from '@common/services/cache.service';
import { sha256 } from '@common/utils/crypto.util';
import { generateOtp } from '@common/utils/code-generator.util';
import { Compare, Hash } from '@common/utils/hash';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Organization } from '../../organization/entities/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { IsNull, Repository } from 'typeorm';
import {
  OTP_TTL_SECONDS,
  OTP_MAX_ATTEMPTS,
  OTP_LOCK_SECONDS,
  OTP_REQUEST_LIMIT,
  OTP_REQUEST_WINDOW_SECONDS,
} from '@auth/constants/auth.constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly cacheService: CacheService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  private getDevOtp(): string {
    return process.env.DEV_OTP ?? '00000';
  }

  private async checkRequestOtpRateLimit(phone: string): Promise<void> {
    const blockedKey = `otp_blocked_${phone}`;
    const isBlocked = await this.cacheService.get(blockedKey);
    if (isBlocked) {
      throw new UnauthorizedException(
        'Too many requests. Please try again later.',
      );
    }

    const countKey = `otp_request_count_${phone}`;
    const current = await this.cacheService.get(countKey);
    const newCount = (Number(current) || 0) + 1;

    await this.cacheService.set(countKey, newCount, OTP_REQUEST_WINDOW_SECONDS);

    if (newCount > OTP_REQUEST_LIMIT) {
      await this.cacheService.set(blockedKey, '1', OTP_LOCK_SECONDS);
      await this.cacheService.del(countKey);
      throw new UnauthorizedException(
        'Too many requests. Please try again later.',
      );
    }
  }

  async ReqOtp(reqOtp: RequestOtpDto) {
    const { phone } = reqOtp;

    await this.checkRequestOtpRateLimit(phone);

    // Check wrong-attempt lock
    const failedKey = `otp_failed_${phone}`;
    const failedCount = Number(await this.cacheService.get(failedKey)) || 0;
    if (failedCount >= OTP_MAX_ATTEMPTS) {
      throw new UnauthorizedException(
        'Too many failed attempts. Please try again later.',
      );
    }

    const code =
      process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
        ? this.getDevOtp()
        : generateOtp();

    const codeHash = await Hash(code);
    await this.cacheService.set(`otp_hash_${phone}`, codeHash, OTP_TTL_SECONDS);

    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(`[DEV OTP] phone=${phone} code=${code}`);
    }

    return {
      message: 'Verification code sent',
      remainingAttempts: OTP_MAX_ATTEMPTS - failedCount,
      ...(process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
        ? { code }
        : {}),
    };
  }

  async VrifyOtp(vrifyOtpDto: VrifyOtpDto) {
    const { phone, otp } = vrifyOtpDto;

    // Wrong-attempt lock check
    const failedKey = `otp_failed_${phone}`;
    const failedCount = Number(await this.cacheService.get(failedKey)) || 0;
    if (failedCount >= OTP_MAX_ATTEMPTS) {
      throw new UnauthorizedException(
        'Too many failed attempts. Please try again later.',
      );
    }

    const hashKey = `otp_hash_${phone}`;
    const storedHash = await this.cacheService.get(hashKey);

    if (!storedHash || typeof storedHash !== 'string') {
      throw new UnauthorizedException(
        'Code expired or not found. Please request a new code.',
      );
    }

    const isValid = await Compare(otp, storedHash);
    if (!isValid) {
      const newFailedCount = failedCount + 1;
      await this.cacheService.set(failedKey, newFailedCount, OTP_LOCK_SECONDS);

      if (newFailedCount >= OTP_MAX_ATTEMPTS) {
        await this.cacheService.del(hashKey);
        throw new UnauthorizedException(
          `Too many failed attempts. Account locked temporarily.`,
        );
      }

      const remaining = OTP_MAX_ATTEMPTS - newFailedCount;
      throw new UnauthorizedException(
        `Invalid code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
      );
    }

    // Cleanup OTP data
    await Promise.all([
      this.cacheService.del(hashKey),
      this.cacheService.del(failedKey),
    ]);

    const user = await this.userRepository.findOne({
      where: { phone },
    });

    if (!user) {
      throw new NotFoundException(
        'User not found. Please contact your administrator.',
      );
    }

    const familyId = randomUUID();

    const accessPayload: JwtPayload = {
      sub: user.id,
      role: user.role,
      orgId: user.orgId,
    };

    const refreshPayload: RefreshTokenPayload = {
      ...accessPayload,
      familyId,
      jti: randomUUID(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtAuthService.generateAccessToken(accessPayload),
      this.jwtAuthService.generateRefreshToken(refreshPayload),
    ]);

    // Store hashed refresh token
    const tokenHash = sha256(refreshToken);
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14d

    await this.refreshTokenRepository.save({
      userId: user.id,
      familyId,
      tokenHash,
      expiresAt,
      revokedAt: null,
    });

    return {
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
  }

  async Refresh(token?: string) {
    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    let payload: RefreshTokenPayload;
    try {
      payload = await this.jwtAuthService.verifyRefreshToken(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const tokenHash = sha256(token);

    const storedToken = await this.refreshTokenRepository.findOne({
      where: { tokenHash },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    // Check if token is revoked (reuse attack)
    if (storedToken.revokedAt) {
      // Revoke entire family
      await this.refreshTokenRepository.update(
        { familyId: payload.familyId, revokedAt: IsNull() },
        { revokedAt: new Date() },
      );
      this.logger.warn(
        `Reused refresh token detected. Revoked family: ${payload.familyId}, user: ${payload.sub}`,
      );
      throw new UnauthorizedException('Invalid or expired session');
    }

    // Mark current token as revoked (rotation)
    await this.refreshTokenRepository.update(storedToken.id, {
      revokedAt: new Date(),
    });

    // Issue new tokens
    const accessPayload: JwtPayload = {
      sub: payload.sub,
      role: payload.role,
      orgId: payload.orgId,
    };

    const refreshPayload: RefreshTokenPayload = {
      ...accessPayload,
      familyId: payload.familyId,
      jti: randomUUID(),
    };

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.jwtAuthService.generateAccessToken(accessPayload),
      this.jwtAuthService.generateRefreshToken(refreshPayload),
    ]);

    // Store new refresh token
    const newTokenHash = sha256(newRefreshToken);
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.save({
      userId: payload.sub,
      familyId: payload.familyId,
      tokenHash: newTokenHash,
      expiresAt,
      revokedAt: null,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async Logout(token?: string) {
    if (!token) return { success: true };

    try {
      const payload = await this.jwtAuthService.verifyRefreshToken(token);
      const tokenHash = sha256(token);

      await this.refreshTokenRepository.update(
        { tokenHash, revokedAt: IsNull() },
        { revokedAt: new Date() },
      );

      this.logger.debug(`User ${payload.sub} logged out`);
    } catch {
      // Token already invalid or expired — still clear cookies
    }

    return { success: true };
  }

  async Me(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const permissions = ROLE_PERMISSIONS[user.role] ?? [];

    let orgName: string | null = null;
    if (user.orgId) {
      const org = await this.organizationRepository.findOne({
        where: { id: user.orgId },
      });
      orgName = org?.name ?? null;
    }

    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      orgId: user.orgId,
      orgName,
      permissions,
    };
  }
}
