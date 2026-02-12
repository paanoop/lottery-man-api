import { Test, TestingModule } from '@nestjs/testing';
import { LotteryResultsService } from './lottery-results.service';

describe('LotteryResultsService', () => {
  let service: LotteryResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LotteryResultsService],
    }).compile();

    service = module.get<LotteryResultsService>(LotteryResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
