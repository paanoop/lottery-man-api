import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LotteryResultsLegacyService } from './lottery-results-legacy.service';
import { CreateLotteryResultsLegacyDto } from './dto/create-lottery-results-legacy.dto';
import { UpdateLotteryResultsLegacyDto } from './dto/update-lottery-results-legacy.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Lottery Results Legacy')
@Controller('lottery-results-legacy')
export class LotteryResultsLegacyController {
  constructor(private readonly lotteryResultsLegacyService: LotteryResultsLegacyService) { }

  @Get()
  @ApiQuery({
    name: 'from',
    required: true,
    description: 'Start date in YYYY-MM-DD format',
    schema: {
      type: 'string',
      format: 'date',
      example: '2024-01-01',
    },
  })
  @ApiQuery({
    name: 'to',
    required: true,
    description: 'End date in YYYY-MM-DD format',
    schema: {
      type: 'string',
      format: 'date',
      example: '2024-01-31',
    },
  })
  async getResults(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.lotteryResultsLegacyService.getResultsByDateRange(from, to);
  }

}
