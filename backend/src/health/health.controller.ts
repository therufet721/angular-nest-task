import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

/**
 * Health check endpoint for monitoring and load balancers
 * Allows external services to verify the application is running
 */
@Controller('health')
@SkipThrottle() // Exclude health checks from rate limiting
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
