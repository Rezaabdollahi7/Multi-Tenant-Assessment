import { CacheService } from '@common/services/cache.service';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { JwtAuthService } from './services/jwt.service';
import { Organization } from '../organization/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken, Organization])],
  controllers: [AuthController],
  providers: [AuthService, CacheService, JwtAuthService, JwtService],
  exports: [JwtAuthService],
})
export class AuthModule {}
