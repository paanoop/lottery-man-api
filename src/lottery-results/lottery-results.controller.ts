import { Controller, Get, Query } from '@nestjs/common';
import { LotteryResultsService } from './lottery-results.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Lottery Results')
@Controller('lottery-results')
export class LotteryResultsController {
  constructor(private readonly service: LotteryResultsService) { }

  @Get()

  @ApiQuery({
    name: 'from',
    required: true,
    description: 'Start date in YYYY-MM-DD format',
    schema: {
      type: 'string',
      format: 'date',
      example: '2026-02-11',
    },
  })
  @ApiQuery({
    name: 'to',
    required: true,
    description: 'End date in YYYY-MM-DD format',
    schema: {
      type: 'string',
      format: 'date',
      example: '2026-02-12',
    },
  })

  async getResults(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.service.getResultsByDateRange(from, to);
  }
}
