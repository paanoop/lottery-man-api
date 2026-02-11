import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LotteryResultsLegacyModule } from './lottery-results-legacy/lottery-results-legacy.module';

@Module({
  imports: [LotteryResultsLegacyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
