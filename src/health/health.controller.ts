import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check() {
    const [dbCheck, mobile, maxResultDate] = await Promise.all([
      this.healthService.checkDatabase(),
      this.healthService.getLatestMobileRelease(),
      this.healthService.getMaxResultDate(),
    ]);

    return {
      status: 'healthy',
      service: 'lottery-man-api',
      version: '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      checks: {
        latestResultDate: maxResultDate,
        database: dbCheck,
        cache: { status: 'healthy', responseTimeMs: 3 }, // unchanged
        externalApi: { status: 'healthy', responseTimeMs: 85 }, // unchanged
        mobile: mobile
          ? {
              version: mobile.version,
              buildNumber: mobile.build_number,
              forceUpdate: !!mobile.is_force_update,
            }
          : null,
      },
    };
  }
}
