import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { HealthModule } from './health/health.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Security: Rate limiting to prevent brute force and DDoS attacks
    // Limits each IP to 100 requests per 60 seconds
    ThrottlerModule.forRoot([{
      ttl: 60000,   // Time window in milliseconds (60 seconds)
      limit: 100,   // Max requests per window
    }]),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack-app'),
    AuthModule,
    UsersModule,
    ItemsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    // Apply rate limiting globally to all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  // NestJS Middleware configuration - applies to all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
