import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LotteryResultsLegacyModule } from './lottery-results-legacy/lottery-results-legacy.module';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LotteryResultsLegacyModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
