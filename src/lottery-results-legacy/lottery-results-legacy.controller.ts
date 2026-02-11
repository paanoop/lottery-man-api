import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LotteryResultsLegacyService } from './lottery-results-legacy.service';
import { CreateLotteryResultsLegacyDto } from './dto/create-lottery-results-legacy.dto';
import { UpdateLotteryResultsLegacyDto } from './dto/update-lottery-results-legacy.dto';

@Controller('lottery-results-legacy')
export class LotteryResultsLegacyController {
  constructor(private readonly lotteryResultsLegacyService: LotteryResultsLegacyService) {}

  @Post()
  create(@Body() createLotteryResultsLegacyDto: CreateLotteryResultsLegacyDto) {
    return this.lotteryResultsLegacyService.create(createLotteryResultsLegacyDto);
  }

  @Get()
  findAll() {
    return this.lotteryResultsLegacyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotteryResultsLegacyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLotteryResultsLegacyDto: UpdateLotteryResultsLegacyDto) {
    return this.lotteryResultsLegacyService.update(+id, updateLotteryResultsLegacyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotteryResultsLegacyService.remove(+id);
  }
}
