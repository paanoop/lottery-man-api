import { Module } from '@nestjs/common';
import { LotteryResultsService } from './lottery-results.service';
import { LotteryResultsController } from './lottery-results.controller';

@Module({
  controllers: [LotteryResultsController],
  providers: [LotteryResultsService],
})
export class LotteryResultsModule { }
