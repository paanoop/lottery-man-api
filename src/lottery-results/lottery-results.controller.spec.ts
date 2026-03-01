import { Test, TestingModule } from '@nestjs/testing';
import { LotteryResultsController } from './lottery-results.controller';
import { LotteryResultsService } from './lottery-results.service';

describe('LotteryResultsController', () => {
  let controller: LotteryResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotteryResultsController],
      providers: [LotteryResultsService],
    }).compile();

    controller = module.get<LotteryResultsController>(LotteryResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
