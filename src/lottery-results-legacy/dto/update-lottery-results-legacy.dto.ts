import { PartialType } from '@nestjs/mapped-types';
import { CreateLotteryResultsLegacyDto } from './create-lottery-results-legacy.dto';

export class UpdateLotteryResultsLegacyDto extends PartialType(CreateLotteryResultsLegacyDto) {}
