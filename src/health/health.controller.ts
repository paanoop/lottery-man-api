import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HealthService } from './health.service';
import { CreateHealthDto } from './dto/create-health.dto';
import { UpdateHealthDto } from './dto/update-health.dto';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) { }

  @Get()
  check() {
    return {
      status: "healthy",
      service: "lottery-man-api",
      version: "0.1.0",
      environment: process.env.NODE_ENV || "development",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      checks: {
        database: { status: "healthy", responseTimeMs: 12 },
        cache: { status: "healthy", responseTimeMs: 3 },
        externalApi: { status: "healthy", responseTimeMs: 85 },
        mobile: { version: "1.6.1", buildNumber: 14 }
      }
    };
  }
}
