import { AppCacheModule } from '@common/modules/cache.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../organization/entities/organization.entity';
import { AuthController } from './controllers/auth.controller';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { JwtAuthService } from './services/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken, Organization]),
    JwtModule.register({}),
    AppCacheModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthService],
  exports: [JwtAuthService],
})
export class AuthModule {}
