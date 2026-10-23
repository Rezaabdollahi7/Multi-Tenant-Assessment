import {
  OTP_LOCK_SECONDS,
  OTP_MAX_ATTEMPTS,
  OTP_REQUEST_LIMIT,
  OTP_REQUEST_WINDOW_SECONDS,
  OTP_TTL_SECONDS,
} from '@auth/constants/auth.constants';
import { RefreshToken } from '@auth/entities/refresh-token.entity';
import { User } from '@auth/entities/user.entity';
import { JwtAuthService } from '@auth/services/jwt.service';
import { JwtPayload } from '@common/@types/jwt-payload.type';
import { REFRESH_TOKEN_TTL_SECONDS } from '@common/constants/jwt.constants';
import { ROLE_PERMISSIONS } from '@common/constants/permissions.constants';
import { CacheService } from '@common/services/cache.service';
import { generateOtp } from '@common/utils/code-generator.util';
import { sha256 } from '@common/utils/crypto.util';
import { compareHash, hash } from '@common/utils/hash';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { IsNull, Repository } from 'typeorm';
import { Organization } from '../../organization/entities/organization.entity';
import {
  CurrentUserDto,
  RequestOtpResponseDto,
} from '../dto/auth-response.dto';

export type SessionTokens = { accessToken: string; refreshToken: string };

const DEFAULT_DEV_OTP = '00000';

class TooManyRequestsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

const otpKeys = (phone: string) => ({
  hash: `otp:hash:${phone}`,
  failedAttempts: `otp:failed:${phone}`,
  requestCount: `otp:requests:${phone}`,
  requestLock: `otp:locked:${phone}`,
});

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

  async requestOtp(phone: string): Promise<RequestOtpResponseDto> {
    const keys = otpKeys(phone);
    await this.enforceRequestLimit(phone);

    const failedAttempts = await this.failedAttempts(phone);
    if (failedAttempts >= OTP_MAX_ATTEMPTS) {
      throw new TooManyRequestsException(
        'Too many failed attempts. Please try again later.',
      );
    }

    const exposeCode = process.env.NODE_ENV !== 'production';
    const code = exposeCode
      ? (process.env.DEV_OTP ?? DEFAULT_DEV_OTP)
      : generateOtp();
    await this.cacheService.set(keys.hash, await hash(code), OTP_TTL_SECONDS);

    return {
      message: 'Verification code sent',
      remainingAttempts: OTP_MAX_ATTEMPTS - failedAttempts,
      ...(exposeCode ? { code } : {}),
    };
  }

  async verifyOtp(phone: string, code: string): Promise<SessionTokens> {
    const keys = otpKeys(phone);

    const failedAttempts = await this.failedAttempts(phone);
    if (failedAttempts >= OTP_MAX_ATTEMPTS) {
      throw new TooManyRequestsException(
        'Too many failed attempts. Please try again later.',
      );
    }

    const storedHash = await this.cacheService.get<string>(keys.hash);
    if (!storedHash) {
      throw new UnauthorizedException(
        'Code expired or not found. Please request a new code.',
      );
    }

    if (!(await compareHash(code, storedHash))) {
      const attempts = failedAttempts + 1;
      await this.cacheService.set(
        keys.failedAttempts,
        attempts,
        OTP_LOCK_SECONDS,
      );
      if (attempts >= OTP_MAX_ATTEMPTS) {
        await this.cacheService.del(keys.hash);
        throw new TooManyRequestsException(
          'Too many failed attempts. Please try again later.',
        );
      }
      const remaining = OTP_MAX_ATTEMPTS - attempts;
      throw new UnauthorizedException(
        `Invalid code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      );
    }

    await Promise.all([
      this.cacheService.del(keys.hash),
      this.cacheService.del(keys.failedAttempts),
    ]);

    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new UnauthorizedException('Invalid code.');
    }

    return this.startTokenFamily(user, randomUUID());
  }

  async refresh(refreshToken: string | undefined): Promise<SessionTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const payload = await this.jwtAuthService.verifyRefreshToken(refreshToken);
    const stored = await this.refreshTokenRepository.findOne({
      where: { tokenHash: sha256(refreshToken) },
    });
    if (!stored) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    if (stored.revokedAt) {
      await this.revokeFamily(stored.familyId);
      this.logger.warn(
        `Refresh token reuse detected; revoked family ${stored.familyId} of user ${stored.userId}`,
      );
      throw new UnauthorizedException('Invalid or expired session');
    }

    await this.refreshTokenRepository.update(stored.id, {
      revokedAt: new Date(),
    });

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) {
      await this.revokeFamily(stored.familyId);
      throw new UnauthorizedException('Invalid or expired session');
    }

    return this.startTokenFamily(user, stored.familyId);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;

    await this.refreshTokenRepository.update(
      { tokenHash: sha256(refreshToken), revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async currentUser(userId: string): Promise<CurrentUserDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const organization = await this.organizationRepository.findOneOrFail({
      where: { id: user.orgId },
    });

    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      organization: { id: organization.id, name: organization.name },
      permissions: [...ROLE_PERMISSIONS[user.role]],
    };
  }

  private async startTokenFamily(
    user: User,
    familyId: string,
  ): Promise<SessionTokens> {
    const accessPayload: JwtPayload = {
      sub: user.id,
      role: user.role,
      orgId: user.orgId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtAuthService.generateAccessToken(accessPayload),
      this.jwtAuthService.generateRefreshToken({
        ...accessPayload,
        familyId,
        jti: randomUUID(),
      }),
    ]);

    await this.refreshTokenRepository.save({
      userId: user.id,
      familyId,
      tokenHash: sha256(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
      revokedAt: null,
    });

    return { accessToken, refreshToken };
  }

  private async revokeFamily(familyId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { familyId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  private async failedAttempts(phone: string): Promise<number> {
    return (
      (await this.cacheService.get<number>(otpKeys(phone).failedAttempts)) ?? 0
    );
  }

  private async enforceRequestLimit(phone: string): Promise<void> {
    const keys = otpKeys(phone);
    if (await this.cacheService.get(keys.requestLock)) {
      throw new TooManyRequestsException(
        'Too many requests. Please try again later.',
      );
    }

    const requests =
      ((await this.cacheService.get<number>(keys.requestCount)) ?? 0) + 1;
    await this.cacheService.set(
      keys.requestCount,
      requests,
      OTP_REQUEST_WINDOW_SECONDS,
    );

    if (requests > OTP_REQUEST_LIMIT) {
      await Promise.all([
        this.cacheService.set(keys.requestLock, true, OTP_LOCK_SECONDS),
        this.cacheService.del(keys.requestCount),
      ]);
      throw new TooManyRequestsException(
        'Too many requests. Please try again later.',
      );
    }
  }
}
