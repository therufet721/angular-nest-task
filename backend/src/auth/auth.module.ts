import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

// Default secret for development only - NEVER use in production
const DEV_JWT_SECRET = 'dev-only-secret-change-in-production';
const DEFAULT_JWT_EXPIRES_SECONDS = 86400; // 1 day in seconds

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('AuthModule');
        const secret = configService.get<string>('JWT_SECRET');
        
        // Security: Warn if using default secret (should never happen in production)
        if (!secret) {
          logger.warn('⚠️  JWT_SECRET not set! Using development default. DO NOT use in production!');
        }
        
        return {
          secret: secret || DEV_JWT_SECRET,
          signOptions: {
            expiresIn: configService.get<number>('JWT_EXPIRES_IN') || DEFAULT_JWT_EXPIRES_SECONDS,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
