import { RequestOtpDto } from '@auth/dto/request-otp.dto';
import { VerifyOtpDto } from '@auth/dto/verify-otp.dto';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_PATH,
  REFRESH_TOKEN_TTL_SECONDS,
} from '@common/constants/jwt.constants';
import { Cookie } from '@common/decorators/cookie.decorator';
import { Public } from '@common/decorators/public.decorator';
import { UserInfo } from '@common/decorators/user.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { CookieOptions, Response } from 'express';
import {
  CurrentUserDto,
  RequestOtpResponseDto,
  SuccessResponseDto,
} from '../dto/auth-response.dto';
import { AuthService, type SessionTokens } from '../services/auth.service';
import { JwtAuthService } from '../services/jwt.service';

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Post('request-otp')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a one-time sign-in code' })
  @ApiOkResponse({ type: RequestOtpResponseDto })
  @ApiTooManyRequestsResponse({ description: 'Too many requests or attempts' })
  requestOtp(@Body() dto: RequestOtpDto): Promise<RequestOtpResponseDto> {
    return this.authService.requestOtp(dto.phone);
  }

  @Post('verify-otp')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify the code and start a session' })
  @ApiOkResponse({ type: SuccessResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired code' })
  @ApiTooManyRequestsResponse({ description: 'Too many wrong attempts' })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto> {
    const tokens = await this.authService.verifyOtp(dto.phone, dto.code);
    this.setSessionCookies(response, tokens);
    return { success: true };
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate the session tokens' })
  @ApiOkResponse({ type: SuccessResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired session' })
  async refresh(
    @Cookie(REFRESH_TOKEN_COOKIE) refreshToken: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto> {
    const tokens = await this.authService.refresh(refreshToken);
    this.setSessionCookies(response, tokens);
    return { success: true };
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End the session and revoke its refresh token' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async logout(
    @Cookie(REFRESH_TOKEN_COOKIE) refreshToken: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto> {
    await this.authService.logout(refreshToken);
    response.clearCookie(ACCESS_TOKEN_COOKIE, {
      ...baseCookieOptions,
      path: '/',
    });
    response.clearCookie(REFRESH_TOKEN_COOKIE, {
      ...baseCookieOptions,
      path: REFRESH_TOKEN_COOKIE_PATH,
    });
    return { success: true };
  }

  @Get('me')
  @ApiOperation({ summary: 'The signed-in User and their Permissions' })
  @ApiOkResponse({ type: CurrentUserDto })
  @ApiUnauthorizedResponse({ description: 'No valid session' })
  me(@UserInfo('sub') userId: string): Promise<CurrentUserDto> {
    return this.authService.currentUser(userId);
  }

  private setSessionCookies(response: Response, tokens: SessionTokens): void {
    response.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
      ...baseCookieOptions,
      path: '/',
      maxAge: this.jwtAuthService.accessTokenTtlSeconds * 1000,
    });
    response.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      ...baseCookieOptions,
      path: REFRESH_TOKEN_COOKIE_PATH,
      maxAge: REFRESH_TOKEN_TTL_SECONDS * 1000,
    });
  }
}
