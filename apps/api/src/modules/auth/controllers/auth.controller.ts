import { RequestOtpDto } from '@auth/dto/req-otp.dto';
import { SummaryUserDataDto } from '@auth/dto/summary-user-otp.dto';
import { VrifyOtpDto } from '@auth/dto/vrify-otp.dto';
import {
  accessTokenExpireTimeByMilliSecond,
  accessTokenName,
  refreshTokenExpireTimeByMilliSecond,
  refreshTokenName,
  secureCookie,
} from '@common/constants/jwt.constants';
import { Cookie } from '@common/decorators/cookie.decorator';
import { Public } from '@common/decorators/public.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserInfo } from './../../../common/decorators/user.decorator';

function accessCookieOptions(): Record<string, unknown> {
  return {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'lax',
    path: '/',
    maxAge: accessTokenExpireTimeByMilliSecond,
  };
}

function refreshCookieOptions(): Record<string, unknown> {
  return {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'lax',
    path: '/auth/refresh',
    maxAge: refreshTokenExpireTimeByMilliSecond,
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a one-time login code' })
  @ApiResponse({ status: 200, description: 'OTP generated' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  ReqOtp(@Body() reqOtpDto: RequestOtpDto) {
    return this.authService.ReqOtp(reqOtpDto);
  }

  @Post('vrify-otp')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid or expired code' })
  async VrifyOtp(
    @Body() vrifyOtpDto: VrifyOtpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.VrifyOtp(vrifyOtpDto);

    response.cookie(
      refreshTokenName,
      tokens.refreshToken,
      refreshCookieOptions(),
    );
    response.cookie(accessTokenName, tokens.accessToken, accessCookieOptions());

    return { success: true };
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access and refresh tokens (rotation)' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid or expired session' })
  async Refresh(
    @Cookie(refreshTokenName) token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.Refresh(token);

    response.cookie(
      refreshTokenName,
      tokens.refreshToken,
      refreshCookieOptions(),
    );
    response.cookie(accessTokenName, tokens.accessToken, accessCookieOptions());

    return { success: true };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiResponse({ status: 200, description: 'Logged out' })
  async Logout(
    @Cookie(refreshTokenName) token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.Logout(token);

    response.clearCookie(refreshTokenName, { path: '/auth/refresh' });
    response.clearCookie(accessTokenName, { path: '/' });

    return { success: true };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user profile and permissions' })
  @ApiResponse({ status: 200, description: 'Current user' })
  Me(@UserInfo('sub') userId: string) {
    return this.authService.Me(userId);
  }

  @Patch('summary-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user name' })
  @ApiResponse({ status: 200, description: 'User updated' })
  SummaryUser(
    @Body() summaryUserDto: SummaryUserDataDto,
    @UserInfo('sub') userId: string,
  ) {
    return this.authService.SummaryUser(summaryUserDto, userId);
  }
}
