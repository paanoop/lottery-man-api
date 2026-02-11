import { Injectable } from '@nestjs/common';
import { CreateLotteryResultsLegacyDto } from './dto/create-lottery-results-legacy.dto';
import { UpdateLotteryResultsLegacyDto } from './dto/update-lottery-results-legacy.dto';

@Injectable()
export class LotteryResultsLegacyService {
  create(createLotteryResultsLegacyDto: CreateLotteryResultsLegacyDto) {
    return 'This action adds a new lotteryResultsLegacy';
  }

  findAll() {
    return `This action returns all lotteryResultsLegacy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lotteryResultsLegacy`;
  }

  update(id: number, updateLotteryResultsLegacyDto: UpdateLotteryResultsLegacyDto) {
    return `This action updates a #${id} lotteryResultsLegacy`;
  }

  remove(id: number) {
    return `This action removes a #${id} lotteryResultsLegacy`;
  }
}
