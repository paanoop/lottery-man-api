import { Module } from '@nestjs/common';
import { LotteryResultsLegacyService } from './lottery-results-legacy.service';
import { LotteryResultsLegacyController } from './lottery-results-legacy.controller';

@Module({
  controllers: [LotteryResultsLegacyController],
  providers: [LotteryResultsLegacyService],
})
export class LotteryResultsLegacyModule {}
