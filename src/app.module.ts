import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LotteryResultsLegacyModule } from './lottery-results-legacy/lottery-results-legacy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LotteryResultsLegacyModule,
  ],
})
export class AppModule { }
